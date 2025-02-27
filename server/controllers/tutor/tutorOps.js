import Tutor from '../../model/tutor.js'

// View Profile

export const loadProfile = async (req,res) => {
    
    try {
        const tutor_ID = req.params.id 
        const tutorData = await Tutor.findById(tutor_ID)
        .select('-password')

        if(!tutorData)return res.status(404).json({message : 'tutor not found'})

        return res.status(200).json(tutorData);

    } catch (error) {
        console.log('Error loading tutor profile');
        res.status(500).json({ message: 'Error loading tutor profile', error: error.message });
    }

}

// Update profile

export const updateProfile = async (req,res) => {
    
    try {
        const tutor_ID = req.params.id;
        const tutor = await Tutor.findById(tutor_ID)
        if(!tutor) return res.status(404).json({message : 'tutor not found'});

        const {firstName, lastName, profileImage, phone, bio, socialLinks,
             expertise, experience, earnings , dob} = req.body;

        const changedData = await Tutor.findByIdAndUpdate(tutor_ID , {
            firstName,
            lastName,
            profileImage,
            phone,
            bio,
            socialLinks,
            expertise,
            experience,
            earnings,
            dob
        } , {new : true})
        .select('-password')

        return res.status(200).json(changedData)

    } catch (error) {
        console.log('Error updating tutor profile');
        res.status(500).json({ message: 'Error updating tutor profile', error: error.message });
    }

}

// delete account

export const deleteAccount = async (req,res) =>{

    try {
        const tutor_ID = req.params.id
        const tutor = await Tutor.findById(tutor_ID)
        if(!tutor) return res.status(404).json({message : 'user not found'})

        await Tutor.findByIdAndDelete(tutor_ID)

        return res.status(200).json({message : 'tutor deleted successfully'})

    } catch (error) {
        console.log('Error deleting tutor profile');
        return res.status(500).json({ message: 'Error deleting tutor profile', error: error.message });
    }

}

// request verification

export const requestVerification = async (req,res) => {
    
    try {
        const tutorID = req.params.id
        const tutor = await Tutor.findById(tutorID)
        if(!tutor) return res.status(404).json({message : 'tutor not found'})
        
        const existingRequest = await Tutor.findOne({ _id : tutorID , status : 'pending' })

        if(existingRequest) return res.status(409).json({message : 'Verification request is pending'})

        const updatedData = await Tutor.findByIdAndUpdate(tutorID,{
            status : 'pending'
        },{new : true}).select('-password')

        return res.status(200).json({message : 'Verification request submitted successfully' ,updatedData})

    } catch (error) {
        console.log('Error requesting Verification in tutor');
        return res.status(500).json({ message: 'Error requesting Verification', error: error.message });
    }

}