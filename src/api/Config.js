export default {
    axiosConfig() {
        const userToken = localStorage.getItem("user")
        return {
            headers: {
            Authorization: `Bearer ${userToken}`,
        },
    }
    }
}