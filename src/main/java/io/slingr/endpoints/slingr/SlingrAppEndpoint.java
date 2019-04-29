package io.slingr.endpoints.slingr;

import io.slingr.endpoints.HttpEndpoint;
import io.slingr.endpoints.exceptions.EndpointException;
import io.slingr.endpoints.exceptions.ErrorCode;
import io.slingr.endpoints.framework.annotations.ApplicationLogger;
import io.slingr.endpoints.framework.annotations.EndpointProperty;
import io.slingr.endpoints.framework.annotations.EndpointWebService;
import io.slingr.endpoints.framework.annotations.SlingrEndpoint;
import io.slingr.endpoints.services.AppLogs;
import io.slingr.endpoints.services.HttpService;
import io.slingr.endpoints.services.IHttpExceptionConverter;
import io.slingr.endpoints.services.rest.RestMethod;
import io.slingr.endpoints.utils.Json;
import io.slingr.endpoints.ws.exchange.WebServiceRequest;
import io.slingr.endpoints.ws.exchange.WebServiceResponse;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * SLINGR Apps endpoint
 *
 * <p>Created by egonzalez on 08/08/17.
 */
@SlingrEndpoint(name = "slingr", functionPrefix = "_")
public class SlingrAppEndpoint extends HttpEndpoint {

    private static final Logger logger = LoggerFactory.getLogger(SlingrAppEndpoint.class);

    @ApplicationLogger
    private AppLogs appLogger;

    @EndpointProperty
    private String userEmail;

    @EndpointProperty
    private String userPassword;

    @EndpointProperty
    private String appUrl;

    @EndpointProperty
    private String webhookToken;

    private SlingrAppExceptionHandler handler = new SlingrAppExceptionHandler();

    @Override
    public String getApiUri() {
        return appUrl + "/api";
    }

    @Override
    public void endpointStarted() {
        try {
            doLogin();
        } catch(Exception e) {
            //do nothing
        }
        httpService().setupExceptionConverter(handler);
    }

    private void doLogin() {
        appLogger.info(String.format("Logging in into [%s] with user [%s]", appUrl, userEmail));
        Json response = httpService().defaultPostRequest(Json.map()
                .set("path", "/auth/login")
                .set("body", Json.map()
                        .set("email", userEmail)
                        .set("password", userPassword)));
        String token = !response.isEmpty("token") ? response.string("token") : null;
        httpService().setupDefaultHeader("token", token);
        handler.retry = false;
        appLogger.info(String.format("Successfully logged in into [%s] with user [%s]", appUrl, userEmail));
    }

    @EndpointWebService(methods = {RestMethod.PUT, RestMethod.POST})
    public WebServiceResponse webhookProcessor(WebServiceRequest request) {
        appLogger.info("Webhook received");
        appLogger.info(request.getJsonBody().toString());
        String sentToken = (String) request.getHeader("token");
        if (StringUtils.isBlank(sentToken) || !sentToken.equals(webhookToken)) {
            return HttpService.defaultWebhookResponse(String.format("Token [%s] is not valid", sentToken), 401);
        }
        events().send("webhook", request.getJsonBody());

        return HttpService.defaultWebhookResponse();
    }

    /**
     * Converts the exceptions to permit to renew the token
     */
    class SlingrAppExceptionHandler implements IHttpExceptionConverter {

        private boolean retry = false;

        @Override
        public EndpointException convertToEndpointException(Exception exception) {
            final EndpointException restException;
            if(exception instanceof EndpointException){
                restException = (EndpointException) exception;
            } else {
                restException = HttpService.defaultConvertToEndpointException(exception);
            }
            if(restException != null){
                if (restException.getAdditionalInfo() != null
                        && !restException.getAdditionalInfo().isEmpty("status")
                        && restException.getAdditionalInfo().integer("status") == 401) {
                    if (!retry) {
                        retry = true;
                        doLogin();
                        return EndpointException.retryable(ErrorCode.API, restException.getMessage());
                    } else {
                        retry = false;
                        return EndpointException.permanent(ErrorCode.API, "Cannot connect to app with configured user and password. Please contact your system administrator.");
                    }
                }
            }
            return restException;
        }
    }
}

