import Tutor from '../../model/tutor.js'


// create tutor

export const addTutor = async (req,res) => {
    
    try {
        const {email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks ,expertise ,experience, earnings, 
             isVerified, isActive, isBlocked ,isAdminVerified} = req.body;

        const emailExist = await Tutor.findOne({email})
        if(emailExist) return res.status(409).json({message : 'tutor already exist'})    

        const tutor = new Tutor({
            email, password , firstName, lastName, phone, profileImage, enrolledCourses,
             bio, socialLinks,expertise ,experience, earnings,
             isVerified : isVerified === 'true',
             isActive : isActive === 'true' ,
             isBlocked : isBlocked === 'true',
             isAdminVerified : isAdminVerified === 'true'
        })

        await tutor.save()

        return res.status(200).json({message : 'tutor added successfully'})

    } catch (error) {
        console.log('Error adding tutor profile',error);
        return res.status(500).json({ message: 'Error adding tutor profile', error: error.message });
    }

}

// view tutors details

export const loadTutors = async (req,res) => {
    
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit
        const search = req.query.search

        const searchQuery = {
            $or : [
                {firstName : {$regex : search, $options : 'i'} },
                {lastName : {$regex : search, $options : 'i'} },
                {email : {$regex : search, $options : 'i'} }
            ]
        }

        const tutorData = await Tutor.find(search ? searchQuery : {})
        .select('email firstName lastName profileImage isVerified isActive isBlocked isAdminVerified expertise experience earnings')
        .skip(skip)
        .limit(limit)

        if(!tutorData || tutorData.length === 0) return res.status(404).json({message : 'user not found'})

        return res.status(200).json(tutorData) 
        
    } catch (error) {
        console.log('Error viewing tutors profiles',error);
        res.status(500).json({ message: 'Error viewing tutors profiles', error: error.message });
    }

}

// view specific tutor details

export const loadTutorDetails = async (req,res) => {
    
    try {
        const tutor_ID = req.params.id
        const tutor = await Tutor.findById(tutor_ID)
        .select('email firstName lastName profileImage isVerified isActive isBlocked isAdminVerified expertise experience earnings')

        if(!tutor) return res.status(404).json({message : 'tutor not found'})
            
        return res.status(200).json(tutor)

    } catch (error) {
        console.log('Error viewing tutor profile',error);
        res.status(500).json({ message: 'Error viewing tutor profile', error: error.message });
    }

} 

// update tutor details

export const updateTutorDetails = async (req,res) => {
    
    try {
        
        const tutor_ID = req.params.id;
        const tutorData = await Tutor.findById(tutor_ID);
        if(!tutorData) return res.status(404).json({message : 'tutor not found'});

        const {firstName, lastName, profileImage, expertise, experience, earnings,
             isVerified, isActive, isBlocked, isAdminVerified } = req.body

        const updatedFields = {
            firstName , lastName , profileImage , expertise , experience , earnings
        }

        if(isVerified !== undefined) updatedFields.isVerified = isVerified === 'true'

        if(isActive !== undefined) updatedFields.isActive = isActive === 'true'

        if(isBlocked !== undefined) updatedFields.isBlocked = isBlocked === 'true' 

        if(isAdminVerified !== undefined) updatedFields.isAdminVerified = isAdminVerified === 'true'

        const updatedData = await Tutor.findByIdAndUpdate(
            tutor_ID, 
            updatedFields ,
            {new : true})
            .select(['firstName', 'lastName', 'profileImage', 'expertise', 'experience','earnings',
                 'isVerified','isActive', 'isBlocked', 'isAdminVerified'])
             
        return res.status(200).json(updatedData)

    } catch (error) {
        console.log('Error updating tutor profile',error);
        res.status(500).json({ message: 'Error updating tutor profile', error: error.message });
    }

}

// delete tutor

export const deleteTutor = async (req,res) => {
    
    try {
        
        const tutor_ID = req.params.id

        const tutor = await Tutor.findById(tutor_ID)
        if(!tutor) return res.status(404).json({message : 'tutor not found'})
        
        await Tutor.findByIdAndDelete(tutor_ID)

        return res.status(200).json({message : 'tutor deleted successfully'})

    } catch (error) {
        console.log('Error deleting tutor profile',error);
        return res.status(500).json({ message: 'Error deleting tutor profile', error: error.message });
    }

}

// load verification requests

export const loadRequests = async (req,res) => {
    
    try {
        
        const request = await Tutor.find({status : 'pending'})

        if(!request) return res.status(404).json({message : 'No pending requests'})

        return res.status(200).json(request)

    } catch (error) {
        console.log('Error loading verification request ',error);
        return res.status(500).json({ message: 'Error loading verification request', error: error.message });
    }

}

// approve verification requests 

export const approveOrRejectrequest = async (req,res) => {
    
    try {
        const {tutorId , input , reason} = req.body

        const tutor = await Tutor.findById(tutorId)

        if(!tutor) return res.status(404).json({message : 'Verification request not found.'})

        if(tutor.status === 'approved' ) return res.status(409).json({message : 'Verification request is already approved'})
        
        if(tutor.status === 'rejected') return res.status(409).json({message : 'Verification request is already rejected'})

        if(input === 'approve'){
            await Tutor.findByIdAndUpdate(tutorId,{status : 'approved'})
            return res.status(200).json({message : `Verification approved for tutor ${tutor?.firstName}`})
        } 
        else if(input === 'reject') {
            await Tutor.findByIdAndUpdate(tutorId,{status : 'approved' , reason})
            return res.status(200).json({message : `Verification rejected for tutor ${tutor?.firstName}`})
        }   
        else return res.status(400).json({message : 'Invalid input' })

    } catch (error) {
        console.log('Error approving tutor ',error);
        return res.status(500).json({ message: 'Error approving tutor ', error: error.message });
    }

}
