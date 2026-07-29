import { readdirSync } from 'node:fs';
const files = readdirSync('./');
console.log(files);