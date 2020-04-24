class services {
    static async register(formData) {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/api/auth/register-user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData })
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }

    static async login(formData) {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/api/auth/login-user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData })
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }


    static async getGenres() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/api/scripts/get-all-genres', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('kfm_')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }

    static async getScripts() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/api/scripts/get-all-scripts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }

    static async getScriptById(id) {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch(`/api/scripts/get-script-by-id/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('kfm_')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }

    static async createScript(formData) {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/api/scripts/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('kfm_')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData })
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }

    static async updateScript(formData, id) {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch(`/api/scripts/update/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('kfm_')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData })
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }

    static async getProfile() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch(`/api/auth/user-data`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('kfm_')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const content = await rawResponse.json();

            resolve(content);
        });
    }
}