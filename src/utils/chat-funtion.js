import AWS from "aws-sdk";
import apiService from "../apiService";
import.meta.env.VITE_API_KEY

export const ReportUserId = async (value) => {
    try {
        const response = await apiService.get(`/report-user?userId=${value}`);
        return response
    } catch (err) {
        console.log(err)
    }
};

export const fetchParticularUserProfile = async (value) => {
    try {
        const response = await apiService.get(`/get-single-user-profile-data?userId=${value}`);
        return response
    } catch (err) {
        console.log(err)
    }
};

export const addImageInS3Bucket = async (data) => {
    console.log(data)
    try {
        AWS.config.update({
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
        });

        const s3 = new AWS.S3({
            params: { Bucket: 'rohit-dhiman-buckt' },
            region: 'us-east-1',
        });


        const params = {
            Bucket: 'rohit-dhiman-buckt',
            Key: data.name,
            Body: data,
        };

        try {
            const upload = s3.putObject(params)
                .on("httpUploadProgress", (evt) => {
                    // console.log("Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%");
                })
                .promise();
            await upload;
            return  `https://rohit-dhiman-buckt.s3.eu-north-1.amazonaws.com/${params.Key}`;
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)

    }
};




//   export const DeleteUserMessage =async (value) => {
//     try {
//         const response = await apiService.get(`/report-user?userId=${value}`);
//         return response
//     } catch (err) {
//         console.log(err)
//     }
//   };
