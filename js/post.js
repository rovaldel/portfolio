document.addEventListener('DOMContentLoaded', () => {
    const postContentContainer = document.getElementById('post-content');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const fetchPost = async () => {
        try {
            const response = await fetch('https://n8n.rodrigovaldelvira.com/webhook/posts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const posts = await response.json();
            const post = posts.find(p => p.id === postId);

            if (post) {
                renderPost(post);
            } else {
                postContentContainer.innerHTML = '<p>Post no encontrado.</p>';
            }
        } catch (error) {
            postContentContainer.innerHTML = '<p>Error al cargar el post.</p>';
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    const renderPost = (post) => {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        postContentContainer.innerHTML = `
            <h1 class="mb-3">${post.title}</h1>
            <p>${post.author} &mdash; ${formattedDate}</p>
            <div>${DOMPurify.sanitize(marked.parse(post.content))}</div>
        `;
    };

    if (postId) {
        fetchPost();
    } else {
        postContentContainer.innerHTML = '<p>No se ha especificado un ID de post.</p>';
    }
});