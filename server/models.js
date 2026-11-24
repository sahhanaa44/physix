import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name:{type:String,required:true}, email:{type:String,required:true,unique:true,lowercase:true},
  passwordHash:{type:String,required:false,default:null}, xp:{type:Number,default:0}, level:{type:Number,default:1},
  streak:{type:Number,default:0}, longestStreak:{type:Number,default:0},
  completedLessons:{type:Number,default:0}, experimentsCompleted:{type:Number,default:0},
  lastActiveDate:{type:Date,default:null}, createdAt:{type:Date,default:Date.now}
});
const experimentSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  title:{type:String,required:true}, mode:{type:String,default:'2D'},
  config:{type:mongoose.Schema.Types.Mixed,default:{}}, createdAt:{type:Date,default:Date.now}
});
const progressSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  lessonId:String, lessonTitle:String, score:Number, completedAt:{type:Date,default:Date.now}
});
export const User=mongoose.model('User',userSchema);
export const Experiment=mongoose.model('Experiment',experimentSchema);
export const Progress=mongoose.model('Progress',progressSchema);
