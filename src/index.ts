import { getAppDescription } from './platform';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
	throw new Error('Application root #app was not found');
}

const heading = document.createElement('h1');
heading.textContent = document.title;
const status = document.createElement('p');
status.setAttribute('role', 'status');
status.textContent = 'Loading app information';
app.append(heading, status);

void getAppDescription()
	.then((description) => {
		status.textContent = description;
	})
	.catch((error: unknown) => {
		status.textContent = `Unable to get app information: ${String(error)}`;
	});
