// import store from '@/store'
import {detect} from 'detect-browser'
import {utilService} from './utilService'

const browser = detect()

const gTrans = {
  '': {
    en: '',
    he: '',
  },
  edit: {
    en: 'Edit',
    he: 'עריכה',
  },
  delete: {
    en: 'Delete',
    he: 'מחיקה',
  },
  'delete-permanently': {
    en: 'Delete Permanently',
    he: 'מחיקה לצמיתות',
  },
  use: {
    en: 'Use',
    he: 'השתמש',
  },
  'make-default': {
    en: 'Make default',
    he: 'קביעה כברירת מחדל',
  },
  close: {
    en: 'CLOSE',
    he: 'סגור',
  },
  next: {
    en: 'Next',
    he: 'הבא',
  },
  prev: {
    en: 'Prev',
    he: 'הקודם',
  },
  user: {
    en: 'user',
    he: 'משתמש',
  },
  users: {
    en: 'users',
    he: 'משתמשים',
  },
  interview: {
    en: 'Interview',
    he: 'ראיון',
  },
  backoffice: {
    en: 'Backoffice',
    he: 'בק אופיס',
  },
  profile: {
    en: 'Profile',
    he: 'פרופיל',
  },
  logout: {
    en: 'Logout',
    he: 'התנתקות',
  },
  applicant: {
    en: 'Applicant',
    he: 'מועמד',
  },
  template: {
    en: 'template',
    he: 'תבנית',
  },
  all: {
    en: 'All',
    he: 'הכל',
  },
  'by-jobs': {
    en: 'By jobs',
    he: 'לפי משרה',
  },
  applications: {
    en: 'Applications',
    he: 'מועמדים',
  },
  applicants: {
    en: 'Applicants',
    he: 'מועמדים',
  },
  activity: {
    en: 'Activity',
    he: 'פעילות',
  },
  link: {
    en: 'link',
    he: 'קישור',
  },
  bookmarks: {
    en: 'Bookmarks',
    he: 'מועדפים',
  },
  'read-more': {
    en: 'Read more',
    he: 'קרא עוד',
  },
  'read-less': {
    en: 'Read less',
    he: 'קרא פחות',
  },
  'copy-link': {
    en: 'Copy link',
    he: 'העתק קישור',
  },
  'my-jobs': {
    en: 'My jobs',
    he: 'המשרות שלי',
  },
  'create-new-interview': {
    en: 'Create new interview',
    he: 'צור ראיון חדש',
  },
  'create-new': {
    en: 'Create new',
    he: 'צור חדש',
  },
  show: {
    en: 'Show',
    he: 'הצג',
  },
  showing: {
    en: 'Showing',
    he: 'מציג',
  },
  'show-all': {
    en: 'Show all',
    he: 'הצג הכל',
  },
  'show-archived': {
    en: 'Show archived',
    he: 'הצג ארכיון',
  },
  'show-incomplete': {
    en: 'Show incomplete interviews',
    he: 'הצג ראיונות חלקיים',
  },
  'show-complete': {
    en: 'Show complete interviews',
    he: 'הצג ראיונות מלאים',
  },
  'complete-interviews': {
    en: 'Complete interviews',
    he: 'ראיונות מלאים',
  },
  'incomplete-interviews': {
    en: 'Incomplete interviews',
    he: 'ראיונות שנפסקו',
  },

  // SIDE NAV:
  job: {
    en: 'Job',
    he: 'משרה',
  },
  jobs: {
    en: 'Jobs',
    he: 'משרות',
  },
  archive: {
    en: 'Archive',
    he: 'ארכיון',
  },
  'archive-lowercase': {
    en: 'archive',
    he: 'ארכיון',
  },
  templates: {
    en: 'Templates',
    he: 'תבניות',
  },
  accounts: {
    en: 'Accounts',
    he: 'חשבונות',
  },
  activities: {
    en: 'Activities',
    he: 'פעולות',
  },
  logs: {
    en: 'Logs',
    he: 'לוג',
  },

  // SORTABLE HEADERS:
  location: {
    en: 'Location',
    he: 'מיקום',
  },
  hometown: {
    en: 'Hometown',
    he: 'עיר מגורים',
  },
  status: {
    en: 'Status',
    he: 'סטטוס',
  },
  date: {
    en: 'Date',
    he: 'תאריך',
  },
  'application-link': {
    en: 'Application link',
    he: 'קישור להזמנה',
  },
  'template-name': {
    en: 'Template name',
    he: 'שם התבנית',
  },
  'creation-date': {
    en: 'Creation date',
    he: 'נוצר בתאריך',
  },
  creator: {
    en: 'Creator',
    he: 'יוצר',
  },
  'first-name': {
    en: 'First name',
    he: 'שם פרטי',
  },
  'last-name': {
    en: 'Last name',
    he: 'שם משפחה',
  },
  'last-login': {
    en: 'Last login',
    he: 'התחברות אחרונה',
  },
  'account-name': {
    en: 'Account name',
    he: 'שם החשבון',
  },
  email: {
    en: 'Email',
    he: 'אימייל',
  },
  phone: {
    en: 'Phone',
    he: 'טלפון',
  },
  description: {
    en: 'Description',
    he: 'תיאור המשרה',
  },
  'no-description': {
    en: 'No description',
    he: 'ללא תיאור',
  },
  'uploaded-at': {
    en: 'Uploaded at',
    he: 'הועלה ב',
  },
  resume: {
    en: 'Resume',
    he: 'קורות חיים',
  },
  'email-address': {
    en: 'Email address',
    he: 'כתובת אימייל',
  },
  password: {
    en: 'Password',
    he: 'סיסמה',
  },
  login: {
    en: 'Login',
    he: 'התחברות',
  },
  signup: {
    en: 'Sign up',
    he: 'הרשמה',
  },
  'confirm-password': {
    en: 'Confirm password',
    he: 'אימות סיסמה',
  },
  or: {
    en: 'OR',
    he: 'או',
  },
  clear: {
    en: 'Clear',
    he: 'נקה',
  },
  save: {
    en: 'Save',
    he: 'שמירה',
  },
  minutes: {
    en: 'minutes',
    he: 'דקות',
  },
  minute: {
    en: 'minute',
    he: 'דקה',
  },
  seconds: {
    en: 'seconds',
    he: 'שניות',
  },
  note: {
    en: 'Note',
    he: 'הערה',
  },
  evaluation: {
    en: 'Evaluation',
    he: 'הערכה',
  },
  recruitment: {
    en: 'Recruitment',
    he: 'גיוס',
  },
  continue: {
    en: 'Continue',
    he: 'המשך',
  },
  'time-limit': {
    en: 'Time limit:',
    he: 'הגבלת זמן:',
  },
  submit: {
    en: 'Submit',
    he: 'שליחה',
  },
  'stay-on-current-question': {
    en: 'Stay on current question',
    he: 'הישאר בשאלה הנוכחית',
  },
  'continue-to-next-question-title': {
    en: 'Are you sure you want to continue to the next question?',
    he: 'האם אתה בטוח שברצונך להמשיך לשאלה הבאה?',
  },
  'you-have-time-to-answer': {
    en: 'You still have some time to answer this question',
    he: 'נותר לך זמן לענות על השאלה',
  },
  'save-and-proceed': {
    en: 'Save & Proceed',
    he: 'שמור והמשך',
  },
  'yes-im-sure': {
    en: "Yes, i'm sure",
    he: 'כן, בואו נמשיך',
  },
  'finish-interview': {
    en: 'Finish interview',
    he: 'סיים ראיון',
  },
  'retake-question': {
    en: 'Retake question',
    he: 'הקלט שוב',
  },
  'start-recording': {
    en: 'Start recording',
    he: 'התחל הקלטה',
  },
  'stop-recording': {
    en: 'Stop recording',
    he: 'עצור הקלטה',
  },

  interviews: {
    en: 'Interviews',
    he: 'ראיונות',
  },
  time: {
    en: 'Time',
    he: 'זמן',
  },
  source: {
    en: 'Source',
    he: 'מקור',
  },
  level: {
    en: 'Level',
    he: 'שלב',
  },
  message: {
    en: 'Message',
    he: 'הודעה',
  },
  'trace-id': {
    en: 'Trace ID',
    he: 'קוד זיהוי',
  },
  'account-Email': {
    en: 'Account email',
    he: 'אימייל',
  },

  // SEARCH FILTER BOX:
  'last-week': {
    en: 'Past week',
    he: 'שבוע אחרון',
  },
  'last-month': {
    en: 'Past month',
    he: 'חודש אחרון',
  },
  'last-3-months': {
    en: 'Past 3 months',
    he: 'שלושה חודשים אחרונים',
  },

  // PAGE- NOT FOUND
  'page-not-found': {
    en: 'Page Not Found',
    he: 'הדף המבוקש לא נמצא',
  },

  // PAGE-LOGIN
  'login-title': {
    en: 'Login to your account',
    he: 'כניסת משתמש',
  },
  'forgot-my-password': {
    en: 'Forgot my password',
    he: 'שכחתי סיסמה',
  },
  'continue-with-google': {
    en: 'Continue with Google',
    he: 'המשך עם גוגל',
  },
  'not-have-an-account-yet': {
    en: 'You do not have an account yet?',
    he: 'עדיין אין לך משתמש?',
  },
  'signup-and-get-10-interviews': {
    en: 'Sign up now and get free 10 video interviews',
    he: 'הירשם עכשיו וקבל 10 ראיונות וידאו בחינם',
  },

  // PAGE-SIGNUP
  // TODO: FIND BETTER TRANSLATION - unisex
  //התחילו לקבל ראיונות מוקלטים בווידאו עוד היום  ?
  'signup-header': {
    en: 'Start receiving video recorded interviews today',
    he: 'התחל לקבל ראיונות מוקלטים בווידאו עוד היום',
  },
  'signup-subheading': {
    en: 'Sign up and get access to your new account with 10 free video interviews, no credit card needed',
    he: 'הירשם וקבל גישה לחשבון החדש שלך עם 10 ראיונות וידאו בחינם, ללא צורך בכרטיס אשראי',
  },
  'free-10-video-trial': {
    en: '10 free video interviews trial',
    he: '10 ראיונות וידאו בחינם',
  },
  'get-10-video-for-free': {
    en: 'Get 10 video interviews for free',
    he: 'קבל 10 ראיונות וידאו בחינם',
  },
  'no-credit-card-required': {
    en: 'No credit card required',
    he: 'לא נדרש כרטיס אשראי',
  },
  EasyToUse: {
    en: 'Easy-to-use',
    he: 'קל לשימוש',
  },
  'recruit-anywhere-with-mobile': {
    en: 'Recruit anywhere with Intervid mobile app',
    he: 'ניתן לגייס מכל מקום עם אפליקצייה מותאמת לנייד',
  },
  'create-your-account': {
    en: 'Create your account',
    he: 'הרשמה',
  },
  'from-date': {
    en: 'From date',
    he: 'מתאריך',
  },
  'to-date': {
    en: 'To date',
    he: 'עד תאריך',
  },
  account: {
    en: 'Account',
    he: 'חשבון',
  },
  'choose-account': {
    en: 'Choose account',
    he: 'בחר חשבון',
  },
  'at-least-6-char': {
    en: '(at least 6 characters)',
    he: '(לפחות 6 תווים)',
  },
  'already-have-an-account': {
    en: 'Already have an account?',
    he: 'כניסה לחשבון קיים',
  },

  // PAGE- FORGOT-PASSWORD
  'forgot-password': {
    en: 'Forgot password',
    he: 'שכחתי סיסמה',
  },
  'reset-my-password': {
    en: 'Reset my password',
    he: 'אפס את הסיסמה',
  },
  'reset-your-password': {
    en: 'Reset your password',
    he: 'איפוס סיסמה',
  },
  'reset-password': {
    en: 'Reset password',
    he: 'אפס סיסמה',
  },
  'send-otp': {
    en: 'Send me a one time password',
    he: 'שלחו לי סיסמה חד פעמית',
  },
  'enter-email-address': {
    en: 'Enter your email address',
    he: 'הזן את כתובת האימייל שלך',
  },
  'enter-the-code-we-sent-to': {
    en: 'Enter the code we sent to',
    he: 'יש להקליד את הקוד החד פעמי שנשלח לכתובת האימייל',
  },
  'small-msg-about-otp': {
    en: 'We sent a 6-digit code to your email address. Enter that code to reset your password',
    he: 'שלחנו לכתובת האימייל שלך קוד בעל 6 תווים. יש להקליד את הקוד על מנת לאפס את הסיסמה שלך ',
  },
  'change-your-password': {
    en: 'Change your password',
    he: 'שינוי סיסמה',
  },
  'change-password': {
    en: 'Change password',
    he: 'שנה סיסמה',
  },
  'new-password': {
    en: 'New password',
    he: 'הסיסמה החדשה',
  },
  'enter-code': {
    en: 'Enter code',
    he: 'הזן קוד',
  },

  // STEPPER
  'return-to-applications': {
    en: 'Return to applications',
    he: 'חזרה למועמדים',
  },
  'job-details': {
    en: 'Job details',
    he: 'פרטי המשרה',
  },
  'edit-question': {
    en: 'Edit question',
    he: 'ערוך שאלה',
  },
  'invite-candidates': {
    en: 'Invite candidates',
    he: 'הזמן מועמדים',
  },

  // PAGE- BACKOFFICE-EMPTY
  'no-exact-matches': {
    en: 'No exact matches',
    he: 'אין התאמות מדויקות',
  },
  'try-changing-or-removing-your-filters': {
    en: 'Try changing or removing some of your filters',
    he: 'נסה לשנות או להסיר חלק מהמסננים',
  },
  'no-applicant-to-show': {
    en: 'No applicants to show',
    he: 'אין מועמדים להציג',
  },
  'no-job-to-show': {
    en: 'No jobs to show',
    he: 'אין משרות להציג',
  },
  'no-template-to-show': {
    en: 'No templates to show',
    he: 'אין תבניות להציג',
  },
  'no-applicant-submitted-yet': {
    en: 'No applicant submitted yet',
    he: 'טרם הוגשו מועמדויות',
  },
  'invite-candidates-to-apply': {
    en: 'Invite candidates to apply',
    he: 'שלח קישור להגשת מועמדות',
  },
  'create-job-and-invite-candidate': {
    en: 'Create a new job and invite candidate to apply',
    he: 'צור משרה חדשה ושלח קישור להגשת מועמדות',
  },
  'create-new-job': {
    en: 'Create New Job',
    he: 'צור משרה חדשה',
  },
  'confirmation-modal': {
    en: 'Are you sure you want to leave?',
    he: 'האם אתה בטוח שאתה מעוניין לעזוב?',
  },
  'confirmation-modal-ans-yes': {
    en: 'Yes',
    he: 'כן',
  },
  'confirmation-modal-ans-no': {
    en: 'No',
    he: 'לא',
  },
  'create-custom-question-and-template': {
    en: 'Create custom questions and templates',
    he: 'צור שאלות ותבניות מותאמות אישית',
  },
  'receive-video-recorded-job-interviews': {
    en: 'Receive video recorded job interviews',
    he: 'קבל ראיונות עבודה מוקלטים בווידאו',
  },
  'watch-video-and-evaluate-msg': {
    en: 'Watch received video interviews at your convenience, review candidates information and evaluate their performance',
    he: 'ניתן לצפות בראיונות וידאו שהתקבלו בזמן שנוח לך, לסקור מידע על המועמדים ולהעריך את ביצועיהם',
  },
  'move-on-with-your-preferred': {
    en: 'Move on with your preferred candidates',
    he: 'התקדם עם המועמדים המועדפים עליך',
  },
  'contect-with-leading-candidates': {
    en: 'Contact with your leading applicants, and save time by schedule frontal meeting only with the icing on the cake.',
    he: 'צור קשר עם המועמדים המובילים שלך, וחסוך זמן על ידי קביעת פגישה פרונטלית רק עם המועמדים המובילים.',
  },
  'publish-or-send-link': {
    en: 'Share a job interview invitation through your favorite contact channels - direct messages, social networks or an embedded invitation on your site',
    he: 'ניתן לשתף את ההזמנה לראיון עבודה דרך ערוצי התקשורת המועדפים עליך - הודעות ישירות, רשתות חברתיות או קישור באתר שלך.',
  },

  // PAGE- BACKOFFICE-BY-APPLICANTS
  'search-applicants': {
    en: 'Search for applicants',
    he: 'חיפוש מועמדים',
  },
  'search-templates': {
    en: 'Search for templates',
    he: 'חיפוש תבניות',
  },
  'search-jobs': {
    en: 'Search for jobs',
    he: 'חיפוש משרות',
  },
  'search-logs': {
    en: 'Search for logs',
    he: 'חיפוש לוגים',
  },
  'by-date': {
    en: 'By date',
    he: 'לפי תאריך',
  },
  'by-status': {
    en: 'By status',
    he: 'לפי סטטוס',
  },
  'view-only': {
    en: 'View only',
    he: 'הצג רק',
  },
  'by-evaluation': {
    en: 'By evaluation',
    he: 'לפי הערכה',
  },
  'clear-filters': {
    en: 'Clear filters',
    he: 'נקה מסננים',
  },
  'show-incomplete-applications': {
    en: 'Show incomplete applications',
    he: 'הצג ראיונות שהופסקו',
  },
  'hide-incomplete-applications': {
    en: 'Hide incomplete applications',
    he: 'הסתר ראיונות שהופסקו',
  },
  'good-fit': {
    en: 'Good fit',
    he: 'התאמה טובה',
  },
  recruit: {
    en: 'Recruit',
    he: 'לגייס',
  },
  'in-progress': {
    en: 'In progress',
    he: 'במהלך ראיון',
  },
  'incomplete-interview': {
    en: 'Incomplete',
    he: 'ראיון חלקי',
  },
  'need-evaluation': {
    en: 'Need evaluation',
    he: 'דרושה הערכה',
  },
  'not-a-fit': {
    en: 'Not a fit',
    he: 'חוסר התאמה',
  },
  maybe: {
    en: 'Maybe',
    he: 'אולי',
  },
  proceed: {
    en: 'Proceed',
    he: 'המשך',
  },
  'proceed-to-recruitment': {
    en: 'Recruit',
    he: 'המשך לגיוס',
  },
  'offer-sent': {
    en: 'Offer sent',
    he: 'הצעה נשלחה',
  },
  'not-interested': {
    en: 'Not interested',
    he: 'לא מעוניין',
  },
  hired: {
    en: 'Hired',
    he: 'גויס',
  },
  demo: {
    en: 'Demo',
    he: 'דמו',
  },

  // PAGE - BACKOFFICE- BY-JOB
  'copy-invitation-url': {
    en: 'Copy invitation URL',
    he: 'העתקת קישור להזמנה',
  },
  'edit-job': {
    en: 'Edit job',
    he: 'עריכת המשרה',
  },
  'clone-job': {
    en: 'Clone job',
    he: 'שכפול המשרה',
  },
  'preview-job': {
    en: 'Preview job',
    he: 'הצגת המשרה',
  },
  restore: {
    en: 'Restore',
    he: 'שחזור',
  },
  'share-job': {
    en: 'Share job',
    he: 'שיתוף משרה',
  },
  'invitation-msg': {
    en: 'Send invitation to potential candidates to apply',
    he: 'שלח את ההזמנה למועמדים פוטנציאליים כדי שיגישו מועמדות',
  },
  share: {
    en: 'Share',
    he: 'שתף',
  },
  'archive-job': {
    en: 'Archive job',
    he: 'שליחה לארכיון',
  },
  'list-view': {
    en: 'List view',
    he: 'תצוגת רשימה',
  },
  'card-view': {
    en: 'Card view',
    he: 'תצוגת כרטיסים',
  },
  'company-name': {
    en: 'Company name',
    he: 'שם הארגון',
  },
  'untitled-job': {
    en: 'Untitled job',
    he: 'משרה ללא שם',
  },
  'job-title': {
    en: 'Job title',
    he: 'שם המשרה',
  },
  'job-description': {
    en: 'Job description',
    he: 'תיאור המשרה',
  },
  'add-description': {
    en: 'Add description',
    he: 'הוספת תיאור המשרה',
  },
  'remove-description': {
    en: 'Remove description',
    he: 'הסרת תיאור המשרה',
  },
  'require-cv': {
    en: 'Require CV',
    he: 'קורות חיים נדרשים',
  },
  'allow-only-one-try': {
    en: 'Allow only one try',
    he: 'אפשר ניסיון אחד בלבד',
  },
  'create-new-template': {
    en: 'Create new template',
    he: 'יצירת תבנית חדשה',
  },
  'video-only': {
    en: 'Video only',
    he: 'הקלטת וידאו',
  },
  'video-and-screen': {
    en: 'Video & Screen',
    he: 'הקלטת מסך ווידאו',
  },
  'interview-questions': {
    en: 'Interview questions',
    he: 'שאלות ראיון עבודה',
  },
  'invitation-to-apply-job': {
    en: 'Invitation to apply to the following job:',
    he: 'הזמנה להגשת מועמדות למשרה הבאה:',
  },
  'apply-for-this-job': {
    en: 'Apply for this job',
    he: 'הגשת מועמדות',
  },
  'video-answer': {
    en: 'Video answer',
    he: 'תשובה בוידאו',
  },
  'code-answer': {
    en: 'Code answer',
    he: 'תשובה בקוד',
  },
  'screen-answer': {
    en: 'Screen & video answer',
    he: 'תשובה בהקלטת מסך',
  },
  'text-answer': {
    en: 'Text answer',
    he: 'תשובה בטקסט',
  },
  'image-answer': {
    en: 'Image answer',
    he: 'תשובה בתמונה',
  },
  'mult-choice-answer': {
    en: 'Multuiple choice question',
    he: 'שאלה אמריקאית',
  },

  // PAGE - TEMPLATE EDIT
  'new-template': {
    en: 'New template',
    he: 'תבנית חדשה',
  },
  'use-template': {
    en: 'Use template',
    he: 'השתמש בתבנית',
  },

  // PAGE - INTERVIEW COMPOSE - JOB FORM
  'invitation-preview': {
    en: 'Invitation preview',
    he: 'תצוגה מקדימה להזמנה',
  },
  'interview-preview': {
    en: 'Interview preview',
    he: 'תצוגה מקדימה לראיון',
  },

  // CREATE JOB
  'candidate-cv': {
    en: 'Candidate CV',
    he: 'קו"ח של המועמד',
  },
  required: {
    en: 'Required',
    he: 'נדרש',
  },
  'not-required': {
    en: 'Not required',
    he: 'לא נדרש',
  },
  'video-recording': {
    en: 'Video recording',
    he: 'מספר נסיונות מענה לכל שאלה',
  },
  'allow-multiple-tries': {
    en: 'Multiple tries',
    he: 'מספר נסיונות',
  },
  'allow-only-once': {
    en: 'One try',
    he: 'נסיון אחד',
  },
  'change-cover': {
    en: 'Change cover',
    he: 'שנה תמונת קאבר',
  },
  'mini-minutes': {
    en: 'm',
    he: 'ד',
  },
  'answer-type-not-available': {
    en: 'This answer type is not available on multiple tries',
    he: 'סוג תשובה לא נתמך בראיון של מספר נסיונות',
  },

  // COVER MENU
  'select-cover-image': {
    en: 'Select cover image',
    he: 'בחר תמונה',
  },
  'no-cover': {
    en: 'No cover',
    he: 'ללא תמונה',
  },
  'your-files': {
    en: 'Your files',
    he: 'התמונות שלך',
  },
  'site-files': {
    en: 'Site files',
    he: 'התמונות של האתר',
  },
  select: {
    en: 'Select',
    he: 'בחירה',
  },
  browse: {
    en: 'Browse',
    he: 'עיון',
  },

  // APP HEADER
  'changes-saved': {
    en: 'All changes saved',
    he: 'כל השינויים נשמרו',
  },
  'required-fields-missing': {
    en: 'Required fields missing',
    he: 'שדות חובה חסרים',
  },
  saving: {
    en: 'Saving...',
    he: 'שומר...',
  },
  send: {
    en: 'Send',
    he: 'שלח',
  },

  // PAGE - INTERVIEW COMPOSE - INVITE CANDIDATES
  'invitation-link-is-ready': {
    en: 'Your invitation link is ready',
    he: 'לינק ההזמנה שלך מוכן',
  },
  'send-iterview-invitation-to-candidates-msg': {
    en: 'Send the interview invitation link to any potential candidate. Click the button below to copy the interview link',
    he: 'ניתן לשלוח את הקישור להזמנה לראיון לכל מועמד פוטנציאלי. לחץ על הכפתור מטה על מנת להעתיק את הקישור לראיון.',
  },
  'copy-invitation-link': {
    en: 'Copy invitation link',
    he: 'העתקת קישור להזמנה',
  },

  // PAGE - INTERVIEW-PREVIEW
  timeline: {
    en: 'Timeline',
    he: 'ציר זמן',
  },
  'evaluation-status-changed-to': {
    en: 'Evaluation status changed to',
    he: 'סטטוס עודכן',
  },
  'has-opened-the-interview': {
    en: 'has opened the interview',
    he: 'פתח את הראיון',
  },
  'has-submitted-the-interview': {
    en: 'has submitted the interview',
    he: 'הגיש את הראיון',
  },
  'has-quit-the-interview': {
    en: 'has quit the interview',
    he: 'יצא מהראיון',
  },
  'has-sent-the-interview': {
    en: 'has sent the interview',
    he: 'שלח ראיון',
  },
  'you-created-a-job': {
    en: 'You created a job',
    he: 'יצרת משרה',
  },

  // PAGE - INTERVIEW-ERROR
  'interview-not-available': {
    en: 'This interview is not available, please contact the recruiter',
    he: 'ראיון זה אינו זמין, אנא צור קשר עם המגייס',
  },
  'interview-includes-screen-answer': {
    en: 'This interview includes screen recorded answers',
    he: 'ראיון זה כולל שאלות הקלטת מסך',
  },
  'device-not-suppport-screen-capture': {
    en: 'Unfortunately, it is not possible to capture screen on your device',
    he: 'לצערנו, הקלטת מסך אינה נתמכת במכשירך',
  },
  'open-in-desktop-browser': {
    en: 'Please open the interview on a desktop browser',
    he: 'אנא פתח ראיון זה במחשב',
  },

  // PAGE - ON-BOARDING - 01
  smile: {
    en: 'Smile!',
    he: 'חייך!',
  },
  'you-about-to-be-on-camera': {
    en: "you're about to be on camera",
    he: 'אתה הולך להיות מצולם',
  },
  'the-interview-will-not-start-yet': {
    en: 'The interview will not start yet',
    he: 'הראיון עדיין לא יתחיל',
  },
  'video-and-audio-test': {
    en: 'Video and audio test',
    he: 'בדיקת ווידאו וסאונד',
  },
  'ask-to-fill-personal-details-msg': {
    en: 'We will ask you to fill in your name, email etc',
    he: 'נבקש למלא פרטים כמו שם, אימייל ועוד',
  },
  'make-sure-your-video-and-audio-working': {
    en: 'Make sure that your camera and microphone are working properly',
    he: 'נוודא שהמצלמה והמיקרופון שלך פועלים כראוי',
  },
  'use-camera-to-answer-the-question': {
    en: 'Use your camera to answer given questions',
    he: 'השתמש במצלמה שלך כדי לענות על שאלות הנתונות',
  },

  // PAGE - ON-BOARDING - 02
  'please-make-sure-you-have': {
    en: 'please make sure you have',
    he: 'נא לוודא שיש לך',
  },
  'to-complete-the-interview': {
    en: 'to complete the interview',
    he: 'להשלמת הראיון',
  },
  'before-the-interview-we-need-to-know-you': {
    en: 'Before we can start with your interview, we need to get to know you a little better',
    he: 'לפני שנתחיל את הראיון נרצה להכיר אותך קצת יותר',
  },
  'be-sure-include-updated-resume': {
    en: 'Be sure to include an updated resume',
    he: 'יש לוודא כי קורות החיים מעודכנים',
  },
  'upload-resume': {
    en: 'Upload resume',
    he: 'העלאת קו"ח',
  },

  // PAGE - ON-BOARDING - 03
  'video-and-audio-check': {
    en: 'Video and audio check',
    he: 'בדיקת ווידאו וסאונד',
  },
  'approve-your-video-and-audio': {
    en: 'Approve your video and audio',
    he: 'בדוק את איכות הוידאו והאודיו שלך',
  },
  'preview-how-you-look-and-sound': {
    en: 'Preview how you look and sound',
    he: 'צפה כיצד תראה ותישמע בראיון',
  },
  'record-and-play-a-short-video-sample-msg': {
    en: 'Record and play a short video sample of you talking so you can see how you’ll look and sound. No one else will see this, and it’s not saved anywhere.',
    he: 'הקלט וצפה בווידאו קצר שלך בו אתה מדבר על מנת לראות כיצד אתה נראה ונשמע. אף אחד לא יצפה בסרטון הזה מלבדך והוא לא מוקלט או נשמר בשום מקום',
  },
  'camera-and-audio-check': {
    en: 'Camera and audio check',
    he: 'בדיקת מצלמה ואודיו',
  },
  'update-settings': {
    en: 'Update settings',
    he: 'עדכן הגדרות',
  },
  'say-something': {
    en: 'Say something',
    he: 'אמור משהו',
  },
  'for-example': {
    en: 'For example',
    he: 'לדוגמא',
  },
  'im-just-testing-my-audio-and-video': {
    en: '“I’m just testing my audio and video”',
    he: '"אני רק בודק את איכות הוידאו והאודיו שלי"',
  },
  'your-results': {
    en: 'Your results',
    he: 'התוצאות שלך',
  },
  'fix-the-issues-and-then-click-check-again': {
    en: 'Fix the following issues then click "check again"',
    he: 'תקן את הסוגיות הבאות ולחץ "בדוק שנית"',
  },
  microphone: {
    en: 'Microphone',
    he: 'מקרופון',
  },
  camera: {
    en: 'Camera',
    he: 'מצלמה',
  },
  screen: {
    en: 'Screen',
    he: 'מסך',
  },
  connection: {
    en: 'Connection',
    he: 'חיבור לרשת',
  },
  'check-again': {
    en: 'Check again',
    he: 'בדוק שנית',
  },
  audio: {
    en: 'audio',
    he: 'אודיו',
  },
  video: {
    en: 'video',
    he: 'וידאו',
  },
  settings: {
    en: 'Settings',
    he: 'הגדרות',
  },
  'reload-devices': {
    en: 'Reload devices',
    he: 'טען מחדש',
  },
  'play-the-video-clip-to-see-how-youll-look-and-sound': {
    en: 'Play the video clip to see how you’ll look and sound',
    he: 'הפעל את הוידאו על מנת לראות איך אתה נראה ונשמע',
  },
  'video-and-audio-check-msg': {
    en: 'Center your face in the frame and talk when video and audio are captured correctly, the camera and microphone indicators shall change from red to',
    he: 'יש למרכז את הפנים בפריים ולדבר. כאשר הווידאו והאודיו נלכדים בצורה נכונה, מחווני המצלמה והמיקרופון ישתנו מאדום ל',
  },
  green: {
    en: 'GREEN',
    he: 'ירוק',
  },
  'center-your-face-and-talk': {
    en: 'Center your face in the frame and talk',
    he: 'מרכז את הפנים שלך בפריים ודבר',
  },
  'your-face-and-voice-are-captured': {
    en: 'Great! Your face and Voice are captured perfectly',
    he: 'מעולה! הפנים והקול שלך נקלטו בהצלחה',
  },

  // PAGE - ON-BOARDING - 04
  'you-ready-to-go': {
    en: 'You are ready to go!',
    he: 'אתה מוכן לצאת לדרך!',
  },
  'click-to-start-the-interview': {
    en: 'Click the button below to start the interview',
    he: 'לחץ על הכפתור למטה כדי להתחיל את הראיון',
  },
  'the-interview-include': {
    en: 'The interview includes',
    he: 'הראיון כולל',
  },
  questions: {
    en: 'questions',
    he: 'שאלות',
  },
  question: {
    en: 'Question',
    he: 'שאלה',
  },
  of: {
    en: 'of',
    he: 'מתוך',
  },
  'one-question': {
    en: 'one question',
    he: 'שאלה אחת',
  },
  'and a total answer time of': {
    en: 'and a total answer time of',
    he: 'והזמן הכולל הוא',
  },
  'getting-ready-media-check': {
    en: 'Getting ready for video & audio check',
    he: 'מתכונן לבדיקת וידאו ושמע',
  },
  'start-interview': {
    en: 'Start interview',
    he: 'התחל ראיון',
  },

  'recording-has-not-yet-begun': {
    en: 'Recording has not yet begun',
    he: 'ההקלטה טרם החלה',
  },
  'to-begin-recording-click-start-recording': {
    en: 'To begin click "start recording"',
    he: 'על מנת להתחיל לחץ על "התחל הקלטה"',
  },
  'your-screen-is-being-captured': {
    en: 'Your screen is being captured',
    he: 'המסך שלך מוקלט',
  },
  'interview-start-in': {
    en: 'Interview will start in',
    he: 'הראיון יתחיל בעוד',
  },
  'recording-start-in': {
    en: 'Recording will start in',
    he: 'ההקלטה תתחיל בעוד',
  },
  'time-limit-for-answer': {
    en: 'Time limit for your answer',
    he: 'מגבלת הזמן עבור שאלה זו',
  },

  // INTERVIEW ERRORS:
  'share-screen': {
    en: 'Share screen',
    he: 'שתף מסך',
  },
  'reload-camera': {
    en: 'Reload camera',
    he: 'טען מצלמה מחדש ',
  },
  'try-again': {
    en: 'Try again',
    he: 'נסה שוב',
  },
  'scan-again': {
    en: 'Scan again',
    he: 'סרוק שנית',
  },
  'time-is-running-out': {
    en: 'Time is running out!',
    he: 'הזמן אוזל!',
  },
  'you-ran-out-of-time': {
    en: 'You ran out of time',
    he: 'תם זמן הראיון',
  },
  'moving-on-in': {
    en: 'Moving on in',
    he: 'ממשיך בעוד',
  },
  'next-question': {
    en: 'Next question',
    he: 'שאלה הבאה',
  },

  // PAGE- INTERVIEW
  'do-not-close-this-window': {
    en: 'Please DO NOT CLOSE this window',
    he: 'נא לא לסגור את חלון זה',
  },
  'your-inteview-recordings-uploaded': {
    en: 'Your interview recordings are being uploaded',
    he: 'הקלטת הראיון שלך בהעלאה',
  },
  'no-internet-connection': {
    en: 'No internet connection',
    he: 'החיבור לאינטרנט אבד',
  },
  'make-sure-wifi-connected': {
    en: 'Please Make sure that Wi-Fi or mobile data is connected, then your interview will be uploaded automatically',
    he: 'אנא וודא שהחיבור לאינטרנט תקין, ואז הראיון שלך יועלה אוטומטית',
  },

  // PAGE - INTEVIEW END
  thanks: {
    en: 'Thanks!',
    he: 'כל הכבוד!',
  },
  'your-application-has-been-successfully-sent': {
    en: 'Your application has been successfully sent',
    he: 'הראיון שלך נשלח בהצלחה',
  },
  'well-be-in-touch-with-you-as-soon-as-possible': {
    en: 'The recruiter will be in touch with you as soon as possible',
    he: 'המגייס ייצור איתך קשר מוקדם ככל הניתן',
  },

  // PAGE - USER MGMT
  'add-fname': {
    en: 'Add first name',
    he: 'הוספת שם פרטי',
  },
  'add-lname': {
    en: 'Add last name',
    he: 'הוספת שם משפחה',
  },
  'add-email': {
    en: 'Add email address',
    he: 'הוספת כתובת אימייל',
  },
  'phone-number': {
    en: 'Phone number',
    he: 'טלפון',
  },
  'add-phone-number': {
    en: 'Add phone number',
    he: 'הוספת טלפון',
  },
  'profile-image': {
    en: 'Profile image',
    he: 'תמונת פרופיל',
  },
  'logo-image': {
    en: 'Logo image',
    he: 'תמונת לוגו',
  },
  'home-address': {
    en: 'Home address',
    he: 'כתובת',
  },
  'add-home-address': {
    en: 'Add home address',
    he: 'הוספת כתובת',
  },
  company: {
    en: 'Company',
    he: 'ארגון',
  },
  'add-company-name': {
    en: 'Add company name',
    he: 'הוספת שם הארגון',
  },
  'company-logo': {
    en: 'Company logo',
    he: 'לוגו',
  },
  'organization-users': {
    en: 'Organization users',
    he: 'משתמשי הארגון',
  },
  'edit-user': {
    en: 'Edit User',
    he: 'עריכת משתמש',
  },
  'add-user': {
    en: 'Add User',
    he: 'הוספת משתמש',
  },
  'add-user-to-organization': {
    en: 'Add user to your organization',
    he: 'הוספת משתמש לארגון שלך',
  },
  'no-users': {
    en: 'No users',
    he: 'אין משתמשים מקושרים לארגון',
  },
  actions: {
    en: 'Actions',
    he: 'פעולות',
  },
  'no-results': {
    en: 'No results',
    he: 'אין תוצאות',
  },

  // PERMISSION MANAGEMENT

  starter: {
    en: 'Starter',
    he: 'מתחיל',
  },
  basic: {
    en: 'Basic',
    he: 'בסיס',
  },
  enterprise: {
    en: 'Enterprise',
    he: 'Enterprise',
  },
  professional: {
    en: 'Professional',
    he: 'מקצועי',
  },
  'all-features': {
    en: 'All features',
    he: 'כל היכולות',
  },
  plan: {
    en: 'Plan',
    he: 'מסלול',
  },
  plans: {
    en: 'Plans',
    he: 'מסלולים',
  },
  'exceptional-permissions': {
    en: 'Exceptional permissions',
    he: 'הרשאות חריגות',
  },
  'unlimited-interviews': {
    en: 'Unlimited interviews',
    he: 'ללא הגבלת ראיונות',
  },
  'add-quest': {
    en: 'Add questions',
    he: 'הוספת שאלות',
  },
  'mult-user-org': {
    en: 'Multiple users organization',
    he: 'ארגון מרובה משתמשים',
  },
  'mult-department-org': {
    en: 'Multiple departments organization',
    he: 'ארגון מרובה מחלקות',
  },

  // PAGE- APPLICANT DETAILS
  'return-to-archive': {
    en: 'Return to archive',
    he: 'חזרה לארכיון',
  },
  'return-to-applicants': {
    en: 'Return to applicants',
    he: 'חזרה למועמדים',
  },
  'return-to': {
    en: 'Return to',
    he: 'חזרה ל',
  },
  'latest-note': {
    en: 'Latest note',
    he: 'הערה אחרונה',
  },
  'add-note-on-candidate': {
    en: 'Add your thoughts on this candidate',
    he: 'מה דעתך על מועמד זה?',
  },

  // PAGE - CREATE JOB
  'go-next': {
    en: 'Next',
    he: 'המשך',
  },
  'go-back': {
    en: 'Back',
    he: 'חזור',
  },
  'add-title': {
    en: 'Add title',
    he: 'הוסף כותרת',
  },
  'add-location': {
    en: 'Add location',
    he: 'הוסף מיקום',
  },
  'question-title': {
    en: 'Question title',
    he: 'כותרת השאלה',
  },
  // @Rotem ask where to put it:
  'time-stamp': {
    en: 'Time stamp',
    he: 'נקודת זמן',
  },
  remove: {
    en: 'Remove',
    he: 'מחיקה', // from google forms
  },
  search: {
    en: 'Search',
    he: 'חיפוש',
  },
  duplicate: {
    en: 'Duplicate',
    he: 'שכפול עותק',
  },
  'add-question': {
    en: 'Add question',
    he: 'הוספת שאלה',
  },
  embed: {
    en: 'Embed',
    he: 'הטמעה',
  },
  whatsapp: {
    en: 'Whatsapp',
    he: 'וואטסאפ',
  },
  facebook: {
    en: 'Facebook',
    he: 'פייסבוק',
  },
  heading1: {
    en: 'Heading 1',
    he: 'כותרת 1',
  },
  heading2: {
    en: 'Heading 2',
    he: 'כותרת 2',
  },
  normal: {
    en: 'Normal',
    he: 'רגיל',
  },

  // PAGE - INTEVIEW
  'job-information': {
    en: 'Job information',
    he: 'פרטי המשרה',
  },
  'we-will-present-the-job-info': {
    en: 'We will present the job details such as location, job description and more',
    he: ' נציג את פרטי המשרה כמו מיקום, תיאור המשרה ועוד',
  },
  'fill-in-your-personal-details': {
    en: 'Fill in your personal details',
    he: 'מילוי פרטים אישיים',
  },
  'total-answer-time-of': {
    en: 'and a total answer time of',
    he: 'וזמן כולל לתשובה של',
  },
  'invitation-to-apply-the-following-job': {
    en: 'Invitation to apply the following job',
    he: 'הזמנה להגשת מועמדות למשרה הבאה',
  },

  // VIDEO-PLAYER:
  speed: {
    en: 'Change speed',
    he: 'קבע מהירות',
  },
  'add-screen': {
    en: 'Add screen',
    he: 'מסך נוסף',
  },
  'view-question': {
    en: 'View question',
    he: 'צפה בשאלה',
  },
  'switch-screen': {
    en: 'Switch screen',
    he: 'החלף מסך',
  },
  'full-screen': {
    en: 'Full screen',
    he: 'מסך מלא',
  },

  // MOBILE MODALS:
  'update status': {
    en: 'Update status',
    he: 'עדכן סטאטוס',
  },
  'filter-btn': {
    en: 'Filter',
    he: 'מסננים',
  },
  filter: {
    en: 'Filter',
    he: 'סנן',
  },
  'job-actions': {
    en: 'Job actions',
    he: 'פעולות עבור המשרה',
  },
  'user-menu': {
    en: 'User menu',
    he: 'תפריט משתמש',
  },
  'applicant-menu': {
    en: 'Applicant menu',
    he: 'תפריט מועמד',
  },
  'upload-cv': {
    en: 'Upload CV',
    he: 'העלאת קורות חיים',
  },
  'template-menu': {
    en: 'Template menu',
    he: 'תפריט תבנית',
  },
  'quest-menu': {
    en: 'Question menu',
    he: 'תפריט שאלה',
  },
  'time-event-menu': {
    en: 'Note menu',
    he: 'תפריט הערה',
  },
  'interview-form-menu': {
    en: 'Question menu',
    he: 'תפריט שאלה',
  },
  'timelimit-menu': {
    en: 'Question time limit',
    he: 'הגבלת זמן לשאלה',
  },
  'ans-rule-menu': {
    en: 'Answer type',
    he: 'מענה באמצעות',
  },

  // APPLICANT EDIT:
  'edit-applicant': {
    en: 'Edit applicant',
    he: 'עריכת פרטי המועמד',
  },
  'f-name': {
    en: 'First name',
    he: 'שם פרטי',
  },
  'l-name': {
    en: 'Last name',
    he: 'שם משפחה',
  },

  // PAGE - VERIFY EMAIL
  'confirm-your-email': {
    en: 'Confirm your email address',
    he: 'אשר את כתובת המייל שלך',
  },
  'confirm-to-activate': {
    en: 'Confirm your email address to activate your account.\nA confirmation message was sent to',
    he: 'אמת את כתובת המייל שלך על מנת להפעיל את החשבון. מייל לאימות נשלח לכתובת: ',
  },
  'email-confirmation-failed': {
    en: 'Email confirmation failed',
    he: 'אימות המייל נכשל',
  },
  'confirmation-code-doesnt-match': {
    en: "Confirmation code doesn't match our records",
    he: 'קוד האימות אינו תקין',
  },
  'try-resend-confirmation-email': {
    en: 'Please try again or click the resend button to receive a new confirmation email.',
    he: 'אנא שנית או לחץ על כתוב "שלח מייל שנית" לקבלת מייל אימות נוסף',
  },
  'send-email-again': {
    en: 'Send email again',
    he: 'שלח מייל שנית',
  },

  // MODALS:
  lng: {
    en: 'Language',
    he: 'שפה',
  },

  // INTERVIEW ERROR PAGES:

  // INTERVIEW ERRORS:
  DENIED_SCREEN_ACCESS_TITLE: {
    en: 'Screen permission denied',
    he: 'אין הרשאה לשיתוף המסך',
  },
  DENIED_SCREEN_ACCESS_TXT: {
    en: 'Screen capture permission denied: Please approve screen capture',
    he: 'שיתוף המסך שלך בוטל: אנא אשר את שיתוף המסך',
  },
  DENIED_SCREEN_ACCESS_DESC: {
    en: `1. Click on the "share screen" button in the middle of the screen\n2. Select the screen or window you like to share\n3. Click the "share" button`,
    he: '1.לחץ על כפתור "שתף מסך" מטה\n2. בחר במסך או בחלון שברצונך לשתף\n3. לחץ על הכפתור "שתף" או "SHARE"',
  },
  DENIED_SCREEN_ACCESS_DESC_FIREFOX: {
    en: `1. Click on the "share screen" button in the middle of the screen\n2. Select the screen or window you like to share\n3. Click the "allow" button`,
    he: '1.לחץ על כפתור "שתף מסך" מטה\n2. בחר במסך או בחלון שברצונך לשתף\n3. לחץ על הכפתור "שתף" או "SHARE"',
  },
  DENIED_SCREEN_ACCESS_DESC_MAC: {
    en: `1. Open System Preferences > Security & Privacy > Privacy Tab > Screen Recording (option on lefthand side)\n2. Click the lock at the bottom to make changes\n3. Click the + and add /Applications/${browser.name} 4. Click on the "share screen" button in the middle of the screen\n5. Select the screen or window you like to share\n6. Click the "share" button\n 7. Safari will close and you need to open it again`,
    he: '1. "העדפות מערכת" > "אבטחה ופרטיות" > לשונית פרטיות > הקלטת מסך\n2. לחץ על המנעול בתחתית המסך על מנת לבצע שינויים\n3. סמן את הדפדפן שלך בV או הוסף אותו באמצעות כפתור ה-\'+\'\n4.לחץ על כפתור "שתף מסך" מטה\n5. בחר במסך או בחלון שברצונך לשתף\n6. לחץ על הכפתור "שתף" או "SHARE"\n 7. ספארי יסגר ולאחר מכן תפתח אותו מחדש',
  },

  SAFARI_SCREEN_SHARE_TITLE: {
    en: 'The current screen is being captured',
    he: 'המסך הנוכחי שלך מוקלט',
  },
  SAFARI_SCREEN_SHARE_TXT: {
    en: 'The current screen is being captured',
    he: 'המסך הנוכחי שלך מוקלט',
  },
  SAFARI_SCREEN_SHARE_DESC: {
    en: 'Safari allows to share only the current screen.\nYou can share a different screen by switching to one of the following browsers: Chrome, Edge or Firefox',
    he: 'ספארי מאפשר להקליט את המסך הנוכחי בלבד.\nעל מנת לבחור מסך אחר יש לעבור לאחד מהדפדפנים הבאים: Chrome, Edge or Firefox',
  },

  NO_BROWSER_SUPPORT_TXT: {
    en: 'Your browser is not currently supported',
    he: 'הדפדפן שלך אינו נתמך בשלב זה',
  },
  NO_BROWSER_SUPPORT_DESC: {
    en: 'Install any of the following browsers for full Intervid experience',
    he: 'אנא התקן אחד מבין הדפדפנים הבאים',
  },

  NO_VERSION_SUPPORT_TXT: {
    en: 'Your browser version is not supported',
    he: 'גרסת הדפדפן שלך אינה נתמכת',
  },

  NO_VERSION_SUPPORT_DESC: {
    en: 'Please update your browser version for the full Intervid experience',
    he: 'אנא עדכן את גרסת הדפדפן שלך',
  },

  CAMERA_BUSY_TXT: {
    en: "Camera can't be detected or currently being used by another application: Please make sure that your camera is connected and not in use",
    he: 'לא ניתן לזהות את המצלמה שלך או שהיא נמצאת בשימוש באפליקציה אחרת: אנא וודא שהמצלמה מחוברת כראוי ולא נמצאת בשימוש',
  },
  CAMERA_BUSY_DESC: {
    en: 'Check your camera connection\nClose other applications that currently use your camera\nClick the button in the middle of the screen',
    he: 'בדוק את חיבור המצלמה\nסגור אפליקציות אחרות שמשתמשות במצלמה שלך\nלחץ על כפתור "טען מצלמה מחדש" המופיע מטה',
  },
  CAMERA_BUSY_TITLE: {
    en: "Camera can't be detected",
    he: 'לא ניתן לזהות את המצלמה',
  },

  DENIED_CAM_ACCESS_TITLE: {
    en: 'Camera permission denied',
    he: 'אין הרשאה לשימוש במצלמה',
  },
  DENIED_CAM_ACCESS_TXT: {
    en: 'Camera permission denied: Please grant access to your camera',
    he: 'אין הרשאה לשימוש במצלמה: אנא אשר שימוש במצלמה',
  },
  DENIED_CAM_ACCESS_DESC: {
    en: 'Chrome - At the top right, click Menu ⋮ and then Settings > Click Privacy and security and then Site settings and then Camera or Microphone > Select the option you want as your default setting\nFirefox - In the Menu bar at the top of the screen, click Firefox and select Preferences > Click Privacy & Security from the left menu > Scroll down to the Permissions section > Click the Settings > Use the Allow/Block selector to change permission for the website\nSafari - choose Safari > Preferences, click Websites, then select camera',
    he: 'כרום- לחץ על התפריט ⋮ בצד שמאל למעלה > הגדרות > פרטיות ואבטחה > הגדרות אתר > מצלמה או מיקרופון > בחר בהגדרה הרצויה\nפיירפוקס- לחץ על הפיירפוקס בתפריט בראש המסך > העדפות > פרטיות ואבטחה > לחץ על "הגדרות" בקטגוריית ההרשאות > אשר הרשאה עבור האתר\n לחץ על הסמל ספארי בראש המסך > העדפות > אתרים > בחר מצלמה',
  },
  DENIED_CAM_ACCESS_DESC_CHROME: {
    en: 'At the top right, click Menu ⋮ and then Settings > Click Privacy and security and then Site settings and then Camera or Microphone > Select the option you want as your default setting',
    he: 'לחץ על התפריט ⋮ בצד שמאל למעלה > הגדרות > פרטיות ואבטחה > הגדרות אתר > מצלמה או מיקרופון > בחר בהגדרה הרצויה',
  },
  DENIED_CAM_ACCESS_DESC_FIREFOX: {
    en: 'In the Menu bar at the top of the screen, click Firefox and select Preferences > Click Privacy & Security from the left menu > Scroll down to the Permissions section > Click the Settings > Use the Allow/Block selector to change permission for the website',
    he: 'לחץ על הפיירפוקס בתפריט בראש המסך > העדפות > פרטיות ואבטחה > לחץ על "הגדרות" בקטגוריית ההרשאות > אשר הרשאה עבור האתר',
  },
  DENIED_CAM_ACCESS_DESC_SAFARI: {
    en: 'Choose Safari > Preferences, click Websites, then select camera',
    he: 'לחץ על ספארי בראש המסך > העדפות > אתרים > בחר מצלמה',
  },
  DENIED_CAM_ACCESS_DESC_EDGE_CHROMIUM: {
    en: '1. Select the lock icon located near the left side of your search bar\n2. Select the dropdown menu next to camera\n3. Change the camera access to Allow.\n4. Refresh the browser tab (cmd + R on Mac and F5 on Windows).',
    he: '1. לחץ על המנעול הממוקם בצידה הימני של שורת החיפוש\n2. בחר בתפריט המצלמה\n3. שנה את גישת המצלמה ל"אפשר גישה"\n4. רענן את חלונית הדפדפן (f5 בווינדוס או cmd + R במאק)',
  },

  DENIED_MIC_ACCESS_TITLE: {
    en: 'Microphone permission denied',
    he: 'אין הרשאה לשימוש במיקרופון',
  },
  DENIED_MIC_ACCESS_TXT: {
    en: 'Microphone permission denied: Please grant access to your microphone',
    he: 'אין הרשאה לשימוש במיקרופון: אנא אשר שימוש במיקרופון',
  },
  DENIED_MIC_ACCESS_DESC: {
    en: 'Chrome - At the top right, click Menu ⋮ and then Settings > Click Privacy and security and then Site settings and then Camera or Microphone > Select the option you want as your default setting\nFirefox - In the Menu bar at the top of the screen, click Firefox and select Preferences > Click Privacy & Security from the left menu > Scroll down to the Permissions section > Click the Settings > Use the Allow/Block selector to change permission for the website\nSafari - choose Safari > Preferences, click Websites, then select microphone',
    he: 'כרום- לחץ על התפריט ⋮ בצד שמאל למעלה > הגדרות > פרטיות ואבטחה > הגדרות אתר > מצלמה או מיקרופון > בחר בהגדרה הרצויה\nפיירפוקס- לחץ על הפיירפוקס בתפריט בראש המסך > העדפות > פרטיות ואבטחה > לחץ על "הגדרות" בקטגוריית ההרשאות > אשר הרשאה עבור האתר\n לחץ על הסמל ספארי בראש המסך > העדפות > אתרים > בחר מיקרופון',
  },
  DENIED_MIC_ACCESS_DESC_CHROME: {
    en: 'At the top right, click Menu ⋮ and then Settings > Click Privacy and security and then Site settings and then Camera or Microphone > Select the option you want as your default setting',
    he: 'לחץ על התפריט ⋮ בצד שמאל למעלה > הגדרות > פרטיות ואבטחה > הגדרות אתר > מצלמה או מיקרופון > בחר בהגדרה הרצויה',
  },
  DENIED_MIC_ACCESS_DESC_FIREFOX: {
    en: 'In the Menu bar at the top of the screen, click Firefox and select Preferences > Click Privacy & Security from the left menu > Scroll down to the Permissions section > Click the Settings > Use the Allow/Block selector to change permission for the website',
    he: 'לחץ על פיירפוקס בתפריט בראש המסך > העדפות > פרטיות ואבטחה > לחץ על "הגדרות" בקטגוריית ההרשאות > אשר הרשאה עבור האתר',
  },
  DENIED_MIC_ACCESS_DESC_SAFARI: {
    en: 'Choose Safari > Preferences, click Websites, then select microphone',
    he: 'לחץ על ספארי בראש המסך > העדפות > אתרים > בחר מיקרופון',
  },
  DENIED_MIC_ACCESS_DESC_EDGE_CHROMIUM: {
    en: '1. Select the lock icon located near the left side of your search bar\n2. Select the dropdown menu next to microphone\n3. Change the microphone access to Allow.\n4. Refresh the browser tab (cmd + R on Mac and F5 on Windows).',
    he: '1. לחץ על המנעול הממוקם בצידה הימני של שורת החיפוש\n2. בחר בתפריט המיקרופון\n3. שנה את גישת המיקרופון ל"אפשר גישה"\n4. רענן את חלונית הדפדפן (f5 בווינדוס או cmd + R במאק)',
  },

  MIC_LOW_VOLUME_TITLE: {
    en: 'We didnt quite hear you, try speaking louder',
    he: 'לא הצלחנו לשמוע אותך, נא לדבר חזק יותר',
  },
  MIC_LOW_VOLUME_TXT: {
    en: 'click "Check again" and try speaking louder',
    he: 'לחץ על "בדוק שנית" ולאחר מכן נא לדבר חזק יותר',
  },
  CAMERA_NOT_FOUND_TITLE: {
    en: 'Camera not detected',
    he: 'מצלמה לא זוהתה',
  },

  CAMERA_NOT_FOUND_TXT: {
    en: 'Camera not detected: Please make sure your camera is connected properly',
    he: 'מצלמה לא זוהתה: אנא וודא שהמצלמה מחוברת כראוי',
  },
  CAMERA_NOT_FOUND_DESC: {
    en: "Open the camera selection list by clicking the video icon below and pick your camera\nMake sure your camera is connected properly\nWindows - Find your camera under Cameras, Imaging devices, or Sound, video and game controllers. If you can't find your camera, select the Action menu, then select Scan for hardware changes. Wait for it to scan and reinstall updated drivers, restart your device, then open the Camera app again to test it\nMac - Choose Apple menu > System Preferences, then click Security & Privacy. Click the Privacy tab, then click Camera in the sidebar. Select the checkbox next to the apps that you want to use your camera in. You might be prompted to quit and reopen an app before it can use your camera",
    he: 'לחץ על אייקון המצלמה המופיע מטה ובחר את המצלמה שלך\nוודא שהמצלמה שלך מחוברת כראוי\nווינדוס- חפש את המצלמה תחת מצלמות, התקני דימות או בקרי קול, וידאו ומשחק. אם אתה לא מצליח למצוא את המצלמה שלך, בחר בתפריט פעולה , לאחר מכן בחר בצע סריקה לגילוי שינויי חומרה. המתן עד לביצוע סריקה והתקנה מחדש של מנהלי התקנים מעודכנים, הפעל מחדש את המכשיר ולאחר מכן נסה שוב לפתוח את אפליקציית המצלמה.\nמאק-פתחו את תפריט Apple> "העדפות המערכת", ולאחר מכן לחצו על "אבטחה ופרטיות".לחצו על הכרטיסיה "פרטיות", ולאחר מכן לחצו על "מצלמה" בסרגל הצד. בחרו את תיבת הסימון הסמוכה ליישומים שברצונכם לאפשר להם להשתמש במצלמה. ייתכן שתתבקשו לצאת מיישום ולפתוח אותו מחדש כדי לאפשר לו להשתמש במצלמה.',
  },
  CAMERA_NOT_FOUND_DESC_MAC: {
    en: 'Open the camera selection list by clicking the video icon below and pick your camera\nMake sure your camera is connected properly\nChoose Apple menu > System Preferences, then click Security & Privacy. Click the Privacy tab, then click Camera in the sidebar. Select the checkbox next to the apps that you want to use your camera in. You might be prompted to quit and reopen an app before it can use your camera',
    he: 'לחץ על אייקון המצלמה המופיע מטה ובחר את המצלמה שלך\nוודא שהמצלמה שלך מחוברת כראוי\nפתחו את תפריט Apple> "העדפות המערכת", ולאחר מכן לחצו על "אבטחה ופרטיות".לחצו על הכרטיסיה "פרטיות", ולאחר מכן לחצו על "מצלמה" בסרגל הצד. בחרו את תיבת הסימון הסמוכה ליישומים שברצונכם לאפשר להם להשתמש במצלמה. ייתכן שתתבקשו לצאת מיישום ולפתוח אותו מחדש כדי לאפשר לו להשתמש במצלמה.',
  },
  CAMERA_NOT_FOUND_DESC_WINDOWS: {
    en: "Open the camera selection list by clicking the video icon below and pick your camera\nMake sure your camera is connected properly\nFind your camera under Cameras, Imaging devices, or Sound, video and game controllers. If you can't find your camera, select the Action menu, then select Scan for hardware changes. Wait for it to scan and reinstall updated drivers, restart your device, then open the Camera app again to test it",
    he: 'לחץ על אייקון המצלמה המופיע מטה ובחר את המצלמה שלך\nוודא שהמצלמה שלך מחוברת כראוי\nחפש את המצלמה תחת מצלמות, התקני דימות או בקרי קול, וידאו ומשחק. אם אתה לא מצליח למצוא את המצלמה שלך, בחר בתפריט פעולה , לאחר מכן בחר בצע סריקה לגילוי שינויי חומרה. המתן עד לביצוע סריקה והתקנה מחדש של מנהלי התקנים מעודכנים, הפעל מחדש את המכשיר ולאחר מכן נסה שוב לפתוח את אפליקציית המצלמה.',
  },

  MEDIA_DENIED_BY_SYSTEM_TXT: {
    en: 'Microphone or camera cannot be detected: Please check your media settings on your device',
    he: 'מצלמה או מיקרופון לא מחוברים: אנא בדוק את הגדרות המדיה במכשירך',
  },

  MIC_NOT_FOUND_TXT: {
    en: 'Microphone not detected: Please make sure your microphone is connected properly',
    he: 'מיקרופון לא מחובר: אנא וודא שהמיקרופון מחובר כראוי',
  },
  MIC_NOT_FOUND_DESC: {
    en: 'Open the microphone selection list by clicking the microphone icon below and pick your microphone',
    he: 'לחץ על אייקון המיקרופון המופיע מטה ובחר את המיקרופון שלך\nוודא שהמיקרופון שלך מחובר כראוי\nווינדוס- אם המיקרופון לא מזוהה לאחר עדכון Windows 10, ייתכן שתצטרך לתת הרשאות לאפליקציות שלך להשתמש בו. כדי לאפשר לאפליקציות לגשת למיקרופון, בחר התחלה , לאחר מכן בחר הגדרות > פרטיות > מיקרופון. בחר שנה, לאחר מכן הפעל את אפשר לאפליקציות לגשת אל המיקרופון שלך.\nמאק- פתחו את תפריט Apple> "העדפות המערכת"> שמע > תחת "בחר מכשיר כהתקן שמע"וודא שהמיקרופון מאושר. במידה ואינו מזוהה תצטרך מתאם TRS/TRRS כדי להפעיל את המיקרופון במחשבך.',
  },
  MIC_NOT_FOUND_TITLE: {
    en: 'Microphone not detected',
    he: 'מיקרופון לא מחובר',
  },
  MIC_NOT_FOUND_DESC_MAC: {
    en: 'Open the microphone selection list by clicking the microphone icon below and pick your microphone',
    he: 'לחץ על אייקון המיקרופון המופיע מטה ובחר את המיקרופון שלך\nוודא שהמיקרופון שלך מחובר כראוי\nפתחו את תפריט Apple> "העדפות המערכת"> שמע > תחת "בחר מכשיר כהתקן שמע"וודא שהמיקרופון מאושר. במידה ואינו מזוהה תצטרך מתאם TRS/TRRS כדי להפעיל את המיקרופון במחשבך.',
  },
  MIC_NOT_FOUND_DESC_WINDOWS: {
    en: 'Open the microphone selection list by clicking the microphone icon below and pick your microphone',
    he: 'לחץ על אייקון המיקרופון המופיע מטה ובחר את המיקרופון שלך\nוודא שהמיקרופון שלך מחובר כראוי\nאם המיקרופון לא מזוהה לאחר עדכון Windows 10, ייתכן שתצטרך לתת הרשאות לאפליקציות שלך להשתמש בו. כדי לאפשר לאפליקציות לגשת למיקרופון, בחר התחלה , לאחר מכן בחר הגדרות > פרטיות > מיקרופון. בחר שנה, לאחר מכן הפעל את אפשר לאפליקציות לגשת אל המיקרופון שלך.',
  },

  NOT_RECOGNIZED_TXT: {
    en: 'Face recognition failed: Click "Check again" and center your face in the middle of the frame"',
    he: 'זיהוי הפנים נכשל: לחץ "בדוק שנית" והצג את פניך במרכז המסך',
  },

  NOT_RECOGNIZED_TITLE: {
    en: 'Face recognition failed',
    he: 'זיהוי הפנים נכשל',
  },

  NO_NETWORK_TXT: {
    en: 'No network connection: Please make sure your connection is stable before moving to the next step',
    he: 'אין חיבור לרשת: אנא וודא שהחיבור לרשת יציב בטרם מעבר לשלב הבא',
  },

  NO_NETWORK_TITLE: {
    en: 'No network connection',
    he: 'אין חיבור לרשת',
  },

  NETWORK_UNSTABLE_TXT: {
    en: 'Network connection is unstable and might preventing you from completing the interview',
    he: 'החיבור לרשת אינו יציב ועלול לפגוע בהשלמת הראיון בצורה תקינה',
  },

  NETWORK_UNSTABLE_TITLE: {
    en: 'Unstable connection',
    he: 'החיבור לרשת אינו יציב',
  },

  // ERRORS:
  UNAUTH_ERR: {
    en: 'Please log in first',
    he: 'התחבר להשלמת הפעולה',
  },
  INVALID_TOKEN_ERR: {
    en: 'Invalid Token',
    he: 'טוקן שגוי',
  },
  INVALID_REFRESH_ERR: {
    en: 'Invalid refresh token',
    he: 'טוקן רענון שגוי',
  },
  INVALID_PROVIDER_TOKEN_ERR: {
    en: 'Invalid provider token',
    he: 'טוקן התחברות שגוי',
  },
  MISSING_CRED_ERR: {
    en: 'Email or password not filled in',
    he: 'שם משתמש או סיסמה חסרים',
  },
  INVALID_CRED_ERR: {
    en: 'Invalid email or password',
    he: 'מייל או סיסמה שגויים',
  },
  INVALID_CODE_ERR: {
    en: 'Invalid code',
    he: 'קוד שגוי',
  },
  INVALID_PASS_ERR: {
    en: 'Password should be at least 6 characters long',
    he: 'סיסמה צריכה להכיל לפחות 6 תווים',
  },
  EMAIL_TAKEN_ERR: {
    en: 'Email address is already taken',
    he: 'המייל שנבחר כבר נמצא בשימוש',
  },
  EMAIL_VERIFIED_ERR: {
    en: 'Email address is already verified',
    he: 'מייל זה כבר אושר בעבר',
  },
  INVALID_VERIFY_CODE_ERR: {
    en: 'Invalid verify code',
    he: 'קוד אימות שגוי',
  },
  FORBIDDEN_ERR: {
    en: 'You dont have enough permissions to complete this action',
    he: 'אין מספיק הרשאות כדי לבצע פעולה זו',
  },
  NOT_FOUND_ERR: {
    en: 'Resource not found',
    he: 'לא נמצא השירות המבוקש',
  },

  // Input validations
  REQUIRED_VALIDATE: {
    en: 'This field is required',
    he: 'שדה חובה',
  },
  EMAIL_VALIDATE: {
    en: 'Please enter a valid email',
    he: 'אנא הזן כתובת מייל תקינה',
  },
  EMAIL_TAKEN_VALIDATE: {
    en: 'Email address is already taken',
    he: 'המייל שנבחר כבר נמצא בשימוש',
  },
  PHONE_VALIDATE: {
    en: 'Please enter a valid phone number',
    he: 'אנא הזן מספר טלפון תקין',
  },
  PASSWORD_VALIDATE: {
    en: 'The password must include at least 6 characters, number, both upper and lower case letters',
    he: 'הסיסמה צריכה להכיל לפחות 6 תווים, מספר, אות גדולה ואות קטנה באנגלית',
  },
  CONFIRM_PASSWORD_VALIDATE: {
    en: 'The passwords do not match',
    he: 'הסיסמאות אינן תואמות',
  },
  INVALID_CRED_VALIDATE: {
    en: 'Invalid email or password',
    he: 'מייל או סיסמה שגויים',
  },
  PASS_NOT_MATCH_VALIDATE: {
    en: 'The new passwords do not match',
    he: 'הסיסמאות אינן תואמות',
  },
  CV_VALIDATE: {
    en: 'Please upload an acceptable document format (DOC, DOCX, PDF)',
    he: 'אנא העלה קובץ מבין הפורמטים המקובלים (DOC, DOCX, PDF)',
  },
  OUT_OF_RANGE_VALIDATE: {
    en: 'The number must be within range',
    he: 'המספר חייב להיות בטווח',
  },
  NETWORK_ERR: {
    en: 'NETWORK_ERR',
    he: 'NETWORK_ERR',
  },
}

// TODO: This file should be rethought, most of these functions can probably live in a store module,
// avoiding the need to import the store in every file that needs to use them, and also avoiding
// the need for a global mixin.
// making this change will allow us to remove the store import from this file, which is causing problems, because of the circular dependency.
const DEFAULT_LANG = 'en'
var gLang = DEFAULT_LANG

export function setLang(lang) {
  gLang = lang
}

export function getTrans(str, currLng = gLang || DEFAULT_LANG) {
  // const currLng = store.getters['app/lang']
  const translation = gTrans[str]
  if (!translation) return 'undefined'
  return translation[currLng]
}

export function getPlural(word, count) {
  return count > 1 ? word + 's' : word
}

/**
 * Formats MS to any desired duration.
 * With no options returns H:M h / M:S min / S sec
 * @param {number} ms
 * @param {{noWords:boolean,singleLetter:boolean,fullWord:boolean}} options
 * @returns string
 */
export function formatDuration(ms, {noWords, singleLetter, fullWord} = {}, lang = DEFAULT_LANG) {
  let seconds = ms / 1000
  let minutes = parseInt(seconds / 60)
  seconds = Math.round(seconds % 60)
  const hours = parseInt(minutes / 60)
  minutes = Math.round(minutes % 60)

  const pad2Digit = (num) => num.toString().padStart(2, 0)
  const timeStr = hours ? pad2Digit(hours) + ':' + pad2Digit(minutes) : pad2Digit(minutes) + ':' + pad2Digit(seconds)

  if (noWords) return timeStr

  if (!minutes && !hours) {
    const word = singleLetter ? 's' : fullWord ? getPlural('second', seconds) : 'sec'
    return timeStr + ' ' + word
  }
  let word = hours ? 'h' : 'min'
  if (singleLetter) {
    word = hours ? 'h' : 'm'
  } else if (fullWord) {
    word = hours ? getPlural('hour', hours) : getPlural('minute', minutes)
  }
  return timeStr + ' ' + word
}

export function getAlertTrans(key, item, itemCount) {
  const gMsgTrans = {
    add: {
      en: `${getTrans(item)} added successfully`,
      he: `${getTrans(item)} נוסף בהצלחה`,
    },
    failAdd: {
      en: `Could not add ${getTrans(item)}`,
      he: `הוספת ${getTrans(item)} נכשלה`,
    },
    update: {
      en: `${getTrans(item)} updated successfully`,
      he: `${getTrans(item)} עודכן בהצלחה`,
    },
    failUpdate: {
      en: `Could not update ${getTrans(item)}`,
      he: `עדכון ${getTrans(item)} נכשל`,
    },
    save: {
      en: `${getTrans(item)} saved successfully`,
      he: `${getTrans(item)} נשמר בהצלחה`,
    },
    failSave: {
      en: `Failed to save ${getTrans(item)}`,
      he: `שמירת ${getTrans(item)} נכשלה`,
    },
    start: {
      en: `${item} started the interview`,
      he: `${item} התחיל את הראיון`,
    },
    submit: {
      en: `${item} submitted the interview`,
      he: `${item} השלים את הראיון`,
    },
    quit: {
      en: `${item} left the interview`,
      he: `${item} פרש במהלך הראיון`,
    },
    remove: {
      en: `Removed${itemCount ? ' ' + itemCount : ''} ${getPlural(item, itemCount)} successfully`,
      he: itemCount
        ? `${itemCount} ${getTrans(getPlural(item, itemCount))} נמחקו בהצלחה`
        : `${getTrans(item)} נמחק בהצלחה`,
    },
    failRemove: {
      en: `Could not remove ${getTrans(item)}`,
      he: `מחיקת ${getTrans(item)} נכשלה`,
    },
    archive: {
      en: `Archived${itemCount ? ' ' + itemCount : ''} ${getPlural(item, itemCount)} successfully`,
      he: itemCount
        ? `${itemCount} ${getTrans(getPlural(item, itemCount))} הועברו לארכיון`
        : `${getTrans(item)} הועבר לארכיון`,
    },
    restore: {
      en: `Restored${itemCount ? ' ' + itemCount : ''} ${getPlural(item, itemCount)} successfully`,
      he: itemCount
        ? `${itemCount} ${getTrans(getPlural(item, itemCount))} שוחזרו בהצלחה`
        : `${getTrans(item)} שוחזר בהצלחה`,
    },
    failArchive: {
      en: `Could not archive ${getTrans(item)}`,
      he: `העברת ${getTrans(item)} לארכיון נכשלה`,
    },
    change: {
      en: `${getTrans(item)} changed successfully`,
      he: `${getTrans(item)} שונתה בהצלחה`,
    },
    copy: {
      en: `${getTrans(item)} copied`,
      he: `${getTrans(item)} הועתק`,
    },
    send: {
      en: `${getTrans(item)} sent`,
      he: `${getTrans(item)} נשלח`,
    },
  }

  // const currLng = store.getters['app/lang']
  const currLng = gLang
  return gMsgTrans[key][currLng]
}

export function formatNum(num, currLng = gLang) {
  return new Intl.NumberFormat(currLng).format(num)
}

export function getDateTrans(date) {
  const currLng = gLang
  const options = {
    month: 'short',
    day: 'numeric',
  }
  const dateStr = date.toLocaleDateString(_getLocaleLang(), options)
  if (currLng === 'he') {
    return dateStr
  }
  return dateStr.split(' ').reverse().join(' ')
}

export function formatDate(date, options = {lang: DEFAULT_LANG}) {
  if (typeof date === 'string' || typeof date === 'number') date = new Date(date)
  const now = new Date()
  if (!options.getFullDate && now.getFullYear() === date.getFullYear()) {
    if (now.getDate() === date.getDate() && now.getMonth() === date.getMonth()) {
      return getTimeTrans(date, options.includeSeconds, options.lang)
    } else {
      return getDateTrans(date)
    }
  } else {
    var timeStr = getTimeTrans(date, options.includeSeconds, options.lang)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${options.includeTime ? timeStr : ''}`
  }
}

export function getTimeTrans(date, isIncludeSec, lang) {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  }
  if (isIncludeSec) options.second = '2-digit'
  const currLang = _getLocaleLang(lang)
  return date.toLocaleTimeString(currLang, options)
}

function _getLocaleLang(currLng = gLang) {
  let langFormat = 'en-US'
  if (currLng === 'he') {
    langFormat = 'he-IL'
  }
  return langFormat
}
