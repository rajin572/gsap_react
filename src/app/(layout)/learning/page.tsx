import LearningUseGsap from '@/component/Learning/LearningUseGsap';
import LearningGsapTo from '@/component/Learning/LearningGsapTo';
import LearningGsapFrom from '@/component/Learning/LearningGsapFrom';
import LearningGsapFromTo from '@/component/Learning/LearningGsapFromTo';
import LearningGsapSet from '@/component/Learning/LearningGsapSet';
import LearningAnimatableProperties from '@/component/Learning/LearningAnimatableProperties';

const page = () => {
    return (
        <div className='py-20 space-y-20'>
            <LearningUseGsap />
            <LearningGsapTo />
            <LearningGsapFrom />
            <LearningGsapFromTo />
            <LearningGsapSet />
            <LearningAnimatableProperties />
        </div>
    );
};

export default page;