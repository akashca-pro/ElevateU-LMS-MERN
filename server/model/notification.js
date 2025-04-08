import mongoose from "mongoose";
import { nanoid } from "nanoid";

const notificationSchema = new mongoose.Schema({
    _id : {type : String , default : ()=> nanoid(12) },

    recipientId : { type : String, required : true, refPath : 'recipientType'}, // User, Tutor, or Admin ID
    recipientType : { type : String, enum : ['User','Tutor','Admin'], required : true},

    senderId : { type : String, refPath : 'senderType' },
    senderType : { type : String, enum : ['User','Tutor','Admin'],required : function(){ return !!this.senderId }},

    type : { type : String, 
        enum : ['publish_request','verify_profile','new_enrollment','payment_update','publish_course','suspend_course','suspension_removed','withdraw_request','withdraw_rejected'] },

    message : {type : String, required : true},

    isRead : { type : Boolean, required : true , default : false},

    readAt : { type : Date, default : null }

},{ timestamps: true })

notificationSchema.pre(['findOneAndUpdate', 'updateMany', 'updateOne', 'update'], function(next){
    const update = this.getUpdate();

    if(update.$set && update.$set.isRead){
        update.$set.readAt = new Date()
    }

    next()
})

const Notification = mongoose.model('Notification',notificationSchema)

export default Notification