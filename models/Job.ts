import { model, models, Schema } from "mongoose";


export type JobTypes = {
  _id?: FormDataEntryValue;
  jobTitle: string;
  description: string;
  jobUrl: string;
  location: string;
  language: string;
  workType: string;
  jobCategory: string;
  jobTime: string;
  salary: number;
  salaryLabel: string;
  currency: string;
  salaryDetail: string;
  advertisedDate: string;
  postedDate: string;
  closeDate: string
  education: string;
  companyDetails: {
    ceoCompany: string;
    founded: string;
    companySize: string;
    companyWebsite: string;
  };
  views: number;
  jobPostAuthorId: string;
  createdAt?: Date;
};

export const JobSchema = new Schema({
  jobTitle: { type: String, required: true }, //1
  description: { type: String, required: true },//1
  jobUrl: { type: String, required: true }, //1
  location: { type: String },//1
  language: { type: String },//1
  workType: { type: String },//1
  jobCategory: { type: String },
  jobTime: { type: String },
  salary: { type: Number },//1
  salaryLabel: { type: String },
  currency: { type: String },//1
  salaryDetail: { type: String },//1
  advertisedDate: { type: String },//1
  postedDate: { type: String }, //1
  closeDate: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  education: { type: String },//1
  companyDetails: {
    ceoCompany: { type: String },
    founded: { type: String },
    companySize: { type: String },
    companyWebsite: { type: String },
  },
  views: { type: Number, default: 0 },
  jobPostAuthorId: { type: String },
}, { timestamps: true });


export const Job = models?.Job || model<JobTypes>('Job', JobSchema);