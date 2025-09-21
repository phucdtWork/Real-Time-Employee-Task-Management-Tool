

const checkCurrentUser = (role) => {

    const currentRole = localStorage.getItem('role');

    if (!currentRole || !role?.includes(currentRole)) {
        return false;
    }
    return true;
};

export default checkCurrentUser;