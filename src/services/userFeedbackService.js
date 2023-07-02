import httpService from './httpService'

export const userFeedbackService = {
  postFeedback,
}

const ROUTE = 'feedback'

function postFeedback(userFeedback) {
  console.log('Feedback received successfully', userFeedback)
  // return httpService.post(`${ROUTE}`, userFeedback) // Later, connect the logic to the backend
}
