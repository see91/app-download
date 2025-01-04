import axiosInstance from "../axiosInstance";

export type QuestionStatus = 0 | 1 | 2; // 0: 未回复, 1: 已回复, 2: 关闭

export interface QuestionListItem {
    id: number;
    userAddress: string;
    context: string;
    image: string;
    status: QuestionStatus;
    responseContext: null | string;
    createTime: null | Date;
    updateTime: null | Date;
};

export interface QuestionListResponse {
    records: QuestionListItem[];
    total: number;
    size: number;
    current: number;
    orders: Array<number | string>; // 支持字符串排序
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: null | number;
    maxLimit: null | number;
    pages: number;
};

export interface Response {
    code: number;
    message: string;
    success: boolean;
    data: | string[]
    | { [key: string]: string[] }
    | QuestionListResponse
    | { records: QuestionListItem[] }
    | null;
}

/**
 * Upload Img
 * @param postData 
 * @returns
 */
export const uploadImages = async (postData: FormData): Promise<Response> => {
    try {
        return await axiosInstance.post("problemFeedback/uploadImages", postData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const createQuestion = async (postData: {
    context: string,
    image: string,
    userAddress: string
}): Promise<Response> => {
    try {
        return await axiosInstance.post("problemFeedback/commit", postData);
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const getProblemFeedback = async ({
    pageNumber = 1,
    pageSize = 10,
    status = 0,
    userAddress,
}: {
    pageNumber?: number;
    pageSize?: number;
    status?: QuestionStatus; // 0-未回复，1-已回复
    userAddress: string;
}): Promise<Response> => {
    try {
        return await axiosInstance.get("problemFeedback", { params: { pageNumber, pageSize, status, userAddress } });
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};
