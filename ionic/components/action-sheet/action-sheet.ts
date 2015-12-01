/**
* @ngdoc service
* @name ActionSheet
* @module ionic
* @description
* The ActionSheet is a modal menu with options to select based on an action.
*/
import {Component, Injectable, Renderer, NgFor, NgIf} from 'angular2/angular2';

import {OverlayController} from '../overlay/overlay-controller';
import {Config} from '../../config/config';
import {Icon} from '../icon/icon';
import {Animation} from '../../animations/animation';
import {NavParams} from '../nav/nav-controller';
import {extend} from '../../util/util';

@Component({
  selector: 'ion-action-sheet',
  template:
    '<backdrop (click)="cancel()" tappable disable-activated></backdrop>' +
    '<action-sheet-wrapper>' +
      '<div class="action-sheet-container">' +
        '<div class="action-sheet-group action-sheet-options">' +
          '<div class="action-sheet-title" *ng-if="d.titleText">{{d.titleText}}</div>' +
          '<button (click)="buttonClicked(i)" *ng-for="#b of d.buttons; #i=index" class="action-sheet-option disable-hover">' +
            '<icon [name]="b.icon" *ng-if="b.icon"></icon> ' +
            '{{b.text}}' +
          '</button>' +
          '<button *ng-if="d.destructiveText" (click)="destructive()" class="action-sheet-destructive disable-hover">' +
            '<icon [name]="d.destructiveIcon" *ng-if="d.destructiveIcon"></icon> ' +
            '{{d.destructiveText}}</button>' +
        '</div>' +
        '<div class="action-sheet-group action-sheet-cancel" *ng-if="d.cancelText">' +
          '<button (click)="cancel()" class="disable-hover">' +
            '<icon [name]="d.cancelIcon" *ng-if="d.cancelIcon"></icon> ' +
            '{{d.cancelText}}</button>' +
        '</div>' +
      '</div>' +
    '</action-sheet-wrapper>',
  host: {
    'role': 'dialog'
  },
  directives: [NgFor, NgIf, Icon]
})
class ActionSheetCmp {

  constructor(params: NavParams, renderer: Renderer) {
    this.d = params.data;

    if (this.d.cssClass) {
      renderer.setElementClass(elementRef, this.d.cssClass, true);
    }
  }

  cancel() {
    this.d.cancel && this.d.cancel();
    return this.close();
  }

  destructive() {
    if (this.d.destructiveButtonClicked()) {
      return this.close();
    }
  }

  buttonClicked(index) {
    if (this.d.buttonClicked(index)) {
      return this.close();
    }
  }
}

/**
 * @name ActionSheet
 * @description
 * The Action Sheet is a slide-up pane that lets the user choose from a set of options. Dangerous options are made obvious.
 * There are easy ways to cancel out of the action sheet, such as tapping the backdrop or even hitting escape on the keyboard for desktop testing.
 *
 * @usage
 * ```ts
 * openMenu() {
 *
 *   this.actionSheet.open({
 *     buttons: [
 *       { text: 'Share This' },
 *       { text: 'Move' }
 *     ],
 *     destructiveText: 'Delete',
 *     titleText: 'Modify your album',
 *     cancelText: 'Cancel',
 *     cancel: function() {
 *       console.log('Canceled');
 *     },
 *     destructiveButtonClicked: () => {
 *       console.log('Destructive clicked');
 *     },
 *     buttonClicked: function(index) {
 *       console.log('Button clicked', index);
 *       if(index == 1) { return false; }
 *       return true;
 *     }
 *
 *   }).then(actionSheetRef => {
 *     this.actionSheetRef = actionSheetRef;
 *   });
 *
 * }
 * ```
 */
@Injectable()
export class ActionSheet {

  constructor(ctrl: OverlayController, config: Config) {
    this.ctrl = ctrl;
    this.config = config;
  }

  /**
   * Create and open a new Action Sheet. This is the
   * public API, and most often you will only use ActionSheet.open()
   *
   * @param {Object} [opts={}]  An object containing optional settings.
   * @param {String} [opts.pageType='action-sheet'] The page type that determines how the page renders and animates.
   * @param {String} [opts.enterAnimation='action-sheet-slide-in'] The class used to animate an actionSheet that is entering. 
   * @param {String} [opts.leaveAnimation='action-sheet-slide-out'] The class used to animate an actionSheet that is leaving.
   * @return {Promise} Promise that resolves when the action sheet is open.
   */
  open(opts={}) {
    opts = extend({
      pageType: OVERLAY_TYPE,
      enterAnimation: this.config.get('actionSheetEnter'),
      leaveAnimation: this.config.get('actionSheetLeave'),
      cancelIcon: this.config.get('actionSheetCancelIcon'),
      destructiveIcon: this.config.get('actionSheetDestructiveIcon')
    }, opts);

    return this.ctrl.open(ActionSheetCmp, opts, opts);
  }

  /**
   * Retrieves an actionSheet instance.
   *
   * @param {String} [handle]  The handle used to open the instance to be retrieved.
   * @returns {ActionSheet} An actionSheet instance.
   */
  get(handle) {
    if (handle) {
      return this.ctrl.getByHandle(handle);
    }
    return this.ctrl.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'action-sheet';



class ActionSheetSlideIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.4);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-slide-in', ActionSheetSlideIn);


class ActionSheetSlideOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.4, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-slide-out', ActionSheetSlideOut);


class ActionSheetMdSlideIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.26);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-md-slide-in', ActionSheetMdSlideIn);


class ActionSheetMdSlideOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('backdrop'));
    let wrapper = new Animation(ele.querySelector('action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.26, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-md-slide-out', ActionSheetMdSlideOut);
