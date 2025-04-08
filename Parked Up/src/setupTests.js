/**
 * Jest Test Setup Configuration
 *
 * This file is used to configure and set up the testing environment for Jest, 
 * particularly for integration with React Testing Library.
 * It imports `@testing-library/jest-dom`, which extends Jest's built-in 
 * matchers with additional DOM-related assertions.
 * 
 * The purpose of this file is to provide custom matchers that allow tests 
 * to be written in a more readable and expressive manner when working 
 * with DOM elements.
 * 
 * Key Features:
 * - Adds custom matchers to Jest, such as `toHaveTextContent` and `toBeInTheDocument`, 
 *   that allow for more intuitive assertions on DOM nodes.
 * 
 * Example Usage:
 * 
 * // Before importing @testing-library/jest-dom, your test may look like:
 * expect(element).toContain('some text'); // Works, but it's less readable.
 * 
 * // After importing @testing-library/jest-dom:
 * expect(element).toHaveTextContent(/some text/i); // Much more readable and descriptive.
 * 
 * @see {@link https://github.com/testing-library/jest-dom} for more details on 
 * custom jest matchers provided by jest-dom.
 */
import '@testing-library/jest-dom';
