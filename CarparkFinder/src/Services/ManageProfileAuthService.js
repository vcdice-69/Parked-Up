export const updateUserProfile = async (oldEmail, updatedData) => {
    
    try {
        console.log(updatedData, oldEmail);
        const response = await fetch("http://127.0.0.1:5000/update-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ old_email: oldEmail, ...updatedData }), // Send old email
        });

        console.log("Response status:", response.status);
        return await response.json();
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error("Something went wrong. Please try again.");
    }
};
