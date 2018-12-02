import { browser, by, element, ElementFinder } from 'protractor';

export function getProperty(selector: string, property: string) {
  return browser.executeScript(`
    return document.querySelector('${selector}')['${property}'];
  `);
}

export function getText(selector: string) {
  return browser.executeScript(`
    return document.querySelector('${selector}').textContent;
  `);
}

export function setProperty(selector: string, property: string, value: any) {
  const text = JSON.stringify(value);
  return browser.executeScript(`
    document.querySelector('${selector}')['${property}'] = ${text};
  `);
}

export function waitTime(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export interface LifeCycleCount {
  ionViewWillEnter: number;
  ionViewDidEnter: number;
  ionViewWillLeave: number;
  ionViewDidLeave: number;
}

export async function testLifeCycle(selector: string, expected: LifeCycleCount) {
  const page = element(by.css(selector));
  expect(await getText(`${selector} #ionViewWillEnter`)).toEqual(expected.ionViewWillEnter.toString());
  expect(await getText(`${selector} #ionViewDidEnter`)).toEqual(expected.ionViewDidEnter.toString());
  expect(await getText(`${selector} #ionViewWillLeave`)).toEqual(expected.ionViewWillLeave.toString());
  expect(await getText(`${selector} #ionViewDidLeave`)).toEqual(expected.ionViewDidLeave.toString());
}

export async function testStack(selector: string, expected: string[]) {
  const children = browser.executeScript(`
    return Array.from(
      document.querySelector('${selector}').children
    ).map(el => el.tagName.toLowerCase());
  `);
  expect(children).toEqual(expected);
}
