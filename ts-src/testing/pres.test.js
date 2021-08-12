/**
 * @jest-environment jsdom
 */
import EventMixin from '../eventemitter';
import Model, { Settings,Ori, Type  } from '../model';
import View from '../view';
import { test,describe,jest } from '@jest/globals'
import Pres from '../pres';
import App from '../app'
import dom from './setup'
import { FileWatcherEventKind } from 'typescript';


describe('Presenter', () => {
  let item
  let model
  let view
  let pres
  let document
  beforeEach(() => {
     document=dom.window.document
   item=document.createElement('div')
    model=new Model({},item)
    pres=new Pres(model,item)
    view = new View(pres,{},item)
  });
  test ('should create div element on the page',()=> {
    // const item=document.createElement('div')
    const app=new App(item,{})
    expect(item.children).toBeGreaterThan(0)

  })

  test ('should create instances of classes ',()=> {
    expect(model).toBeDefined()
    expect(pres).toBeDefined()
    expect(view).toBeDefined()

  })
});