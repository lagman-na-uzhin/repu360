import {Controller, Get, Inject, InternalServerErrorException, Post, Query, Res, UseGuards} from '@nestjs/common';
import {DEFAULT_ROUTES} from "@presentation/routes";
import JwtAuthGuard from "@infrastructure/common/guards/jwt-auth.guard";
import {RequestActor} from "@infrastructure/common/decorators/request-actor.decorator";
import {UseCaseProxy} from "@application/use-case-proxies/use-case-proxy";
import {BaseExternalAccountClient, GoogleAuth, OAuth2Client} from 'google-auth-library';
import { google, Auth, mybusinessaccountmanagement_v1, mybusinessbusinessinformation_v1 } from 'googleapis';
import {RequestQuery} from "@infrastructure/common/decorators/request-query.decorator";
import {ExternalProxy} from "@application/use-case-proxies/external/external.proxy";
import {
    SearchGooglePlacesUseCase
} from "@application/use-cases/default/external/search-google-places/search-google-places.usecase";
import {GoogleSearchPlacesRequest} from "@presentation/default/external/dto/google-search-places.request";
import {FastifyReply} from 'fastify';
import {mybusinessaccountmanagement} from "@googleapis/mybusinessaccountmanagement";

@Controller(DEFAULT_ROUTES.EXTERNAL.BASE)
export class ExternalController {
    private oAuth2Client: OAuth2Client;

    constructor(
        @Inject(ExternalProxy.GOOGLE_SEARCH_PLACES)
    private readonly externalGoogleSearchPlaces: UseCaseProxy<SearchGooglePlacesUseCase>
) {
    const clientId = '897931990974-ofcpm9d0jjhder36943mmrj6hm50oqtb.apps.googleusercontent.com';
    const clientSecret = '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';
    const redirectUri = 'http://localhost:3000/google/oauth-callback';

    if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Google OAuth environment variables! Please check .env file.');
    throw new InternalServerErrorException('Server misconfiguration: Google OAuth credentials missing.');
}

this.oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
console.log('OAuth2Client initialized in ExternalController.');
}

@Get(DEFAULT_ROUTES.EXTERNAL.GOOGLE_PLACES_SEARCH)
async googlePlacesSearch(
    @RequestQuery() dto: GoogleSearchPlacesRequest,
@RequestActor() actor
) {
    console.log("googlePlacesSearch", dto);
    return this.externalGoogleSearchPlaces.getInstance().execute(dto.text);
}

@Get('auth')
startAuth(
    @Query('clientId') clientId: string,
@Res() res: FastifyReply,
) {
    if (!clientId) {
        console.error('Auth initiation failed: clientId is missing.');
        throw new InternalServerErrorException('Client ID is required to start OAuth flow.');
    }

    const scopes = ['https://www.googleapis.com/auth/business.manage'];
    const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: clientId,
    });

    console.log(`Redirecting to Google Auth URL for client ${clientId}: ${authUrl}`);
    res.redirect(authUrl);
}

@Get('google/oauth-callback')
async oauthCallback(
    @Query('code') code: string,
@Query('state') clientId: string,
@Query('error') googleError: string,
@Res() res: FastifyReply,
) {
    if (googleError) {
        console.error(`Google OAuth error for client ${clientId}: ${googleError}`);
        return res.redirect(`/dashboard/client/${clientId}?status=error&message=${encodeURIComponent(googleError)}`);
    }

    if (!code || !clientId) {
        console.error(`OAuth callback failed: authorization code or client ID missing. Code: ${code}, ClientId: ${clientId}`);
        throw new InternalServerErrorException('Authorization code or client ID missing from Google callback.');
    }

    console.log(`Received OAuth callback for client ID: ${clientId} with code.`);

    try {
        const {tokens} = await this.oAuth2Client.getToken(code);
        const {access_token, refresh_token} = tokens;

        if (!access_token) {
            throw new Error('No access token received from Google.');
        }
        if (!refresh_token) {
            console.warn(`No refresh token received for client ${clientId}. This might happen on re-authorization if access_type=offline was not set, or prompt=consent not used.`);
        }

        console.log(`Tokens received for client ${clientId}. Access token length: ${access_token.length}, Refresh token present: ${!!refresh_token}`);

        const authClient = new Auth.OAuth2Client();
        authClient.setCredentials({access_token});

        // *** ВАЖНОЕ ИЗМЕНЕНИЕ: Устанавливаем authClient глобально для объекта google ***
        google.options({
            auth: authClient,
        });

        // Теперь, когда аутентификация установлена глобально,
        // можно создавать клиенты API, передавая только версию.
        // Эти клиенты будут автоматически использовать глобальный authClient.
        try {
            const myBusinessAccountMgt = google.mybusinessaccountmanagement("v1");
            console.log(myBusinessAccountMgt, "myBusinessAccountMgt")
            const accountsRes = await myBusinessAccountMgt.accounts.list()
            console.log(accountsRes, "response")
        } catch (e) {
            console.log(e, "eee")
        }

    } catch (error) {
        console.error(`Error during OAuth callback for client ${clientId}: ${error.message}`, error.stack);
        return res.redirect(`/dashboard/client/${clientId}?status=error&message=${encodeURIComponent(error.message)}`);
    }
}
}
