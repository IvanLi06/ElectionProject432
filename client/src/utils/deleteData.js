// endpoint would be something like 'about/' or 'degrees/'
async function deleteData(endpoint, token) {
    const res = await fetch(`${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Attach token to request
        },
    });
    if (!res.ok) {
        throw new Error(`Error deleting data: ${res.statusText}`);
    }
    return await res.json();
}

export default deleteData;
// export {otherFunction, otherFunction2}