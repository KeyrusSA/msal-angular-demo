import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService, ProtectedResourceScopes } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';

function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: 'f9281ae8-a927-49ff-a151-82b31a5c915c',
            authority: 'https://login.microsoftonline.com/bdeade0f-980c-4f3e-840c-c35ace5ea11e',
            redirectUri: '/auth',
        },
        cache: {
            cacheLocation: 'sessionStorage',
            storeAuthStateInCookie: false,
        }
        // cache: {
        //     cacheLocation: BrowserCacheLocation.LocalStorage,
        //     storeAuthStateInCookie: isIE, // set to true for IE 11
        // }
    });
}

function MsalGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: ['User.Read'],
        }
    };
}

function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const myProtectedResourceMap = new Map<string, Array<string| ProtectedResourceScopes> | null>();
    myProtectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [{
      httpMethod: 'GET',
      scopes: ['User.Read']
    }]);

    return {
        interactionType: InteractionType.Popup,
        protectedResourceMap: myProtectedResourceMap
    };
}


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatMenuModule,
        MatCardModule
    ],
    providers: [
      {
        provide: MSAL_INSTANCE,
        useFactory: MSALInstanceFactory
      },
      {
        provide: MSAL_GUARD_CONFIG,
        useFactory: MsalGuardConfigFactory
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
      },
      {
        provide: MSAL_INTERCEPTOR_CONFIG,
        useFactory: MsalInterceptorConfigFactory
      },
      MsalService,
      MsalBroadcastService,
      MsalGuard
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
