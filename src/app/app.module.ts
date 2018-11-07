import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { APP_CONFIG, BaseAppConfig } from "./app.config";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CommentPage } from '../pages/comment/comment';
import { ListPage } from '../pages/list/list';
import { PasswordPage } from '../pages/password/password';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { DetailsPage } from '../pages/details/details';
import { NewsPage } from '../pages/news/news';
import { SearchPage } from '../pages/search/search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { OneSignal } from '@ionic-native/onesignal';
import { AdMobFree } from '@ionic-native/admob-free';
import { MySplashPage } from '../pages/mysplash/mysplash';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        CommentPage,
        PasswordPage,
        SigninPage,
        SignupPage,
        DetailsPage,
        NewsPage,
        SearchPage,
        MySplashPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        CommentPage,
        PasswordPage,
        SigninPage,
        SignupPage,
        DetailsPage,
        NewsPage,
        SearchPage,
        MySplashPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        SocialSharing,
        OneSignal,
        AdMobFree,
        { provide: APP_CONFIG, useValue: BaseAppConfig },
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
