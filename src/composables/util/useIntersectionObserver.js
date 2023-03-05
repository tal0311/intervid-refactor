export function useIntersectionObserver({
  options = {root: document.body, rootMargin: '0px', threshold: 0.01},
  forEachCb = () => {},
}) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(forEachCb)
  }, options)
  const observe = (target) => observer.observe(target)
  const unobserve = (target) => observer.unobserve(target)
  return {observer, observe, unobserve}
}
