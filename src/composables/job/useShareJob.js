import { useStore } from "vuex";
import config from '@/config'


export function useShareJob() {
    const store = useStore()
    
    const shareJob = () => {
        const jobToEdit = store.getters['job/jobToEdit']
        const jobEditErrors = store.getters['job/jobEditErrors']
        const isMobile = store.getters['app/isMobile']
        const invitationUrl = `${config.baseUrl}interview/${jobToEdit._id}`

        if (!jobToEdit._id || (jobEditErrors?.length)) return
        if (isMobile && navigator.share) {
            navigator.share({
                title: 'Interview invitation via Intervid',
                text: `${jobToEdit.company.name} is seeking for ${jobToEdit.info.title}. Click the link to start your interview`,
                url: invitationUrl,
            })
        } else {
            store.dispatch('app/toggleModal', {
                type: 'share',
                isDarkScreen: true,
            })
        }

    }

    return shareJob
}
