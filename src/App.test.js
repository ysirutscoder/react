import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';


describe('App', () => {
    it('отрисовывает без ошибки', () => {
        const div = document.createElement('div'); ReactDOM.render(<App />, div); ReactDOM.unmountComponentAtNode(div);
    });
    test('есть корректный снимок', () => { const component = renderer.create(
        <App /> );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot(); });
});
