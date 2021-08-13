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


  test('should render an element',()=> {
    const el=document.createElement('div')
    const el2=document.createElement('div')

    el2.classList.add('slider-handle')

    document.body.appendChild(el2)
    const handle=document.getElementsByClassName('slider-handle')
    
    view.showSlider(el2,'horizontal')
    expect(item.children.length).toBeGreaterThan(0)
    expect(handle).toBeDefined()

  })

  test ('should create instances of classes ',()=> {
    expect(model).toBeDefined()
    expect(pres).toBeDefined()
    expect(view).toBeDefined()

  })
});