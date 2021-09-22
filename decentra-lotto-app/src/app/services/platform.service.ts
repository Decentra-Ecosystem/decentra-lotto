import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

@Injectable()
export class PlatformCheckerService {

    screenSizeChangeToMobile: Subject<boolean> = new Subject<boolean>();
    mobileSize = 992;
    mobileScreen: boolean;
    hasChanged: any;
    private previousState: any;
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (this.isPlatformBrowser()) {
            window.addEventListener('resize', () => {
                const isMobilePrevious = this.mobileScreen;
                this.mobileScreen = window.innerWidth < this.mobileSize;
                if (isMobilePrevious !== this.mobileScreen) {
                    this.screenSizeChangeToMobile.next(this.mobileScreen);
                }
            });
        }
    }

    /**
 * CHECKS IF PLATFORM IS CLIENT/BROWSER or SERVER/NODE
 * If node/server then we don't run code using certain window or Document objects 
 * This blocks out certain functions from running on Prerender Build
 */

    public setPreviousState(state: any) {
        this.previousState = state;
    }


    public getPreviousState() {
        return this.previousState;
    }

    public isPlatformBrowser() {
        if (isPlatformBrowser(this.platformId)) {
            return true;
        } else {
            return false;
        }
    }

    public isMobile() {
        if (isPlatformBrowser(this.platformId)) {
            if (window.innerWidth <= 992) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    public isIE() {
        const ua = window.navigator.userAgent;
        const msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        } else {
            return false;
        }
    }

    public isEdge() {
        return /Edge/.test(navigator.userAgent);
    }
}

