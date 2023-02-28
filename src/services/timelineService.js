import {getStatusByCode} from '@/services/constData'

export const timelineService = {
  statusEvent(statusCode) {
    return {
      ..._getTimeEvent('status'),
      statusCode,
    }
  },

  noteEvent(txt, noteId, timeStamp = null) {
    return {
      ..._getTimeEvent('note'),
      txt,
      noteId,
      timeStamp,
    }
  },

  activityEvent(activity) {
    return {
      ..._getTimeEvent('activity'),
      activity,
    }
  },

  createdJobEvent(currJob) {
    // const createdAt = store.getters['applicant/job'].createdAt
    const {createdAt} = currJob
    return {
      ..._getTimeEvent('activity', createdAt),
      activity: 'created',
    }
  },
    

  getTimeEventToShow(timeEvent, applicantName, jobTitle, getTrans = (str)=>str.replace('-',' ')) {
    let timeEventToShow = {}
    let status = null
    switch (timeEvent.type) {
      case 'note':
        timeEventToShow = {
          icon: 'description',
          title: getTrans('note'),
          txt: timeEvent.txt,
          color: '#93959c',
        }
        break
      case 'activity':
        switch (timeEvent.activity) {
          case 'sent':
            timeEventToShow = {
              icon: 'send',
              txt: `${applicantName} ${getTrans('has-sent-the-interview')}`,
            }
            break
          case 'opened':
            timeEventToShow = {
              icon: 'file_open',
              txt: `${applicantName} ${getTrans('has-opened-the-interview')}`,
            }
            break
          case 'submitted':
            timeEventToShow = {
              icon: 'send',
              txt: `${applicantName} ${getTrans('has-submitted-the-interview')}`,
            }
            break
          case 'quited':
            timeEventToShow = {
              icon: 'cancel_presentation',
              txt: `${applicantName} ${getTrans('has-quit-the-interview')}`,
            }
            break
          case 'created':
            timeEventToShow = {
              icon: 'add_box',
              txt: `${getTrans('you-created-a-job')}: ${jobTitle}`,
            }
            break
        }
        timeEventToShow.title = getTrans('activity')
        timeEventToShow.color = '#93959c'

        break
      case 'status':
        status = getStatusByCode(timeEvent.statusCode)
        timeEventToShow = {
          icon: 'circle',
          title: getTrans('status'),
          txt: `${getTrans('evaluation-status-changed-to')}: ${getTrans(status.label)}`,
          color: status.color,
        }
        break
    }
    timeEventToShow.txt = timeEventToShow.txt || ''
    return timeEventToShow
  },
}

function _getTimeEvent(type, createdAt = Date.now()) {
  return {
    createdAt,
    type,
  }
}
