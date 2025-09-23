import AWS from "aws-sdk";
import apiService from "../apiService";
import.meta.env.VITE_API_KEY

/**
 * 
 * @param {*} value get report user id and send into backend
 * @returns fetch response
 */
export const ReportUserId = async (data ) => {
    try {
        const response = await apiService.post(`/report-user`, {data});

        // const response = await apiService.get(`/report-user?reportedTo=${reportedTo}&reportedBy=${reportedBy}`);
        return response
    } catch (err) {

        return err
        // console.log(err)
    }
};

/**
 * 
 * @param {*} value get id to get single user profile 
 * @returns 
 */
export const fetchParticularUserProfile = async (value) => {
    let id = localStorage.getItem("user_id")
    try {
        const response = await apiService.get(`/get-single-user-profile-data?userId=${value}&&loginUserId=${id}`);
        return response
    } catch (err) {
        console.log(err)
    }
};

/**
 * 
 * @param {*} data get selcted image data 
 * @returns a url get from S3 bucket
 */
export const addImageInS3Bucket = async (data) => {
    try {
        AWS.config.update({
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
        });

        const s3 = new AWS.S3({
            params: { Bucket: import.meta.env.BUCKET_NAME },
            region: 'us-east-1',
        });


        const params = {
            Bucket: 'rohit-dhiman-buckt',
            Key: data.name,
            Body: data,
        };
        console.log(params)

        try {
            const upload = s3.putObject(params)
                .on("httpUploadProgress", (evt) => {
                })
                .promise();
                console.log(upload)
            await upload;
            return  `https://rohit-dhiman-buckt.s3.eu-north-1.amazonaws.com/${params.Key}`;
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)

    }
};

