import Tutor from '../../model/tutor.js'
import VerificationRequest from '../../model/verificationRequest.js'

// View Profile

export const loadProfile = async (req,res) => {
    
    try {
        const tutor_ID = req.params.id 
        const tutorData = await Tutor.findById(tutor_ID)
        .select('email firstName lastName phone profileImage bio socialLinks expertise experience earnings isAdminVerified')

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
             expertise, experience, earnings} = req.body;

        const changedData = await Tutor.findByIdAndUpdate(tutor_ID , {
            firstName,
            lastName,
            profileImage,
            phone,
            bio,
            socialLinks,
            expertise,
            experience,
            earnings
        } , {new : true})
        .select('firstName lastName profileImage phone bio socialLinks expertise experience earnings')

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
        
        const existingRequest = await VerificationRequest.findOne({ tutorID , status : 'pending' })

        if(existingRequest) return res.status(409).json({message : 'A pending verification request already exists.'})

        const request = new VerificationRequest({
            tutorID,
            name : tutor.firstName
        })

        await request.save()

        return res.status(200).json({message : 'Verification request submitted successfully' })

    } catch (error) {
        console.log('Error requestVerification in tutor');
        return res.status(500).json({ message: 'Error requestVerification in tutor', error: error.message });
    }

}