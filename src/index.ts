import App from './app';
import { PORT } from './env';

const port: number = PORT || 3000;

new App(port).listen();
