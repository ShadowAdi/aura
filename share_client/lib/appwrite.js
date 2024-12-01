import { router } from 'expo-router';
import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
import 'dotenv/config';  
export const config = {  
    endpoint: process.env.APPWRITE_ENDPOINT,  
    platform: process.env.APPWRITE_PLATFORM,  
    projectId: process.env.APPWRITE_PROJECT_ID,  
    databaseId: process.env.APPWRITE_DATABASE_ID,  
    userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID,  
    videoCollectionId: process.env.APPWRITE_VIDEO_COLLECTION_ID,  
    storageId: process.env.APPWRITE_STORAGE_ID,  
};  

const client = new Client()

client.setEndpoint(config.endpoint).setPlatform(config.platform).setProject(config.projectId)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)




export const CreateUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) {
            throw new Error("Failed to create an account");
        }
        const avatarUrl = avatars.getInitials(username);
        await Login(email, password);
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                username,
                email,
                avatar: avatarUrl,
            }
        );
        return newUser;
    } catch (error) {
        throw new Error(error.message || "An error occurred during signup");
    }
};


export const Login = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error.message || "Invalid email or password");
    }
};


export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        throw new Error(error.message || "An error occurred during getting the user");
    }
}


export const GetCurrentUser = async () => {
    try {
        const currentAccount = await getAccount()

        if (!currentAccount) {
            throw new Error("Can't find the current account")
        }
        const currentUser = await databases.listDocuments(config.databaseId, config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)])

        if (!currentUser) {
            throw new Error("Can't find the current user")
        }

        return currentUser.documents[0]
    } catch (error) {
        throw new Error(error.message || "An error occurred during getting the user");
    }
}


export const GetAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt")]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error.message || "An error occurred during getting the posts");
    }

}


export const GetLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt", Query.limit(7))])

        return posts.documents
    } catch (error) {
        throw new Error(error.message || "An error occurred during getting the posts");
    }

}


export const GetSearchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search("title", query)])
        return posts.documents
    } catch (error) {
        throw new Error(error.message || "An error occurred during getting the posts");
    }

}


export async function getUserPosts(userId) {
    try {
        const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId,
            [Query.equal("creator", userId)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}



export const LogoutUser = async () => {
    try {
        const session = await account.deleteSession("current")
        router.replace("/")
        return session
    } catch (error) {
        throw new Error(error.message || "An error occurred during logging out");
    }

}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = storage.getFileView(config.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                config.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid File type");
        }
        if (!fileUrl) {
            throw new Error("File URL generation failed");
        }
        return fileUrl;
    } catch (error) {
        console.error("Error in getFilePreview: ", error);
        throw error;
    }
};

export const uploadFile = async (file, type) => {
    if (!file) {
        console.error("uploadFile: File is null or undefined");
        return;
    }

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.filesize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );
        console.log("Uploaded File: ", uploadedFile);

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        console.error("Error in uploadFile: ", error);
        throw new Error("File upload failed");
    }
};

export const CreateVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);


        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        console.error("Error in CreateVideo: ", error);
        throw new Error(error.message || "Failed to create video document");
    }
};
