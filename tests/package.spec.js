import { Window } from 'happy-dom';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

/**
 * The HTML used to assert our tests against.
 * @type {string}
 */
const htmlDocumentContent = `
  <p>Some HTML content to test</p>
`;

// Initialise Happy DOM
const window = new Window({
  url: 'http://localhost:3000' // A url is required for cookies to work.
});
const document = window.document;

// Make window and document global
global.window = window;
global.document = document;

// Make sure the document is in a clear state before each test.
beforeEach(() => {
  document.body.innerHTML = htmlDocumentContent;
});

afterEach(()=> {
  vi.restoreAllMocks();
});

describe('Tests for our packages', () => {
  it('should work', () => {
    expect(1).toBe(1);
  });
});
