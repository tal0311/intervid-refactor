/**
 * @description A composable to create an IntersectionObserver
 * @param {Function} cb - The callback function to call when the event is triggered
 * @param {Object} options - The options to pass to the IntersectionObserver
 * @param {HTMLElement} options.root - The element that is used as the viewport for checking visiblity of the target. Must be the ancestor of the target. Defaults to body
 * @param {string} options.rootMargin - Margin around the root. Can have values similar to the CSS margin property, e.g. "10px 20px 30px 40px" (top, right, bottom, left). The values can be percentages. Defaults to 0px
 * @param {number} options.threshold - Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed.
 * If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5. Defaults to 0.01
 * @returns {object} An object with an observer, observe, and unobserve functions
 */

export function useIntersectionObserver(
  cb = () => {},
  options = {root: document.body, rootMargin: '0px', threshold: 0.01},
) {
  const observer = new IntersectionObserver(cb, options)

  const observe = (target) => observer.observe(target)
  const unobserve = (target) => observer.unobserve(target)

  return {observer, observe, unobserve}
}
