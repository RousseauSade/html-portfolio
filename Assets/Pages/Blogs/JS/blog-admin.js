document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const newPostBtn = document.getElementById('new-post-btn');
    const managePostsBtn = document.getElementById('manage-posts-btn');
    const newPostSection = document.getElementById('new-post-section');
    const managePostsSection = document.getElementById('manage-posts-section');
    const publishBtn = document.getElementById('publish-btn');
    const postContent = document.getElementById('post-content');
    const postTitle = document.getElementById('post-title');
    const postExcerpt = document.getElementById('post-excerpt');
    const postCategory = document.getElementById('post-category');
    const postStatus = document.getElementById('post-status');
    const postsTable = document.getElementById('posts-table').querySelector('tbody');
    const postPreview = document.getElementById('post-preview');
    const featuredImagePreview = document.getElementById('featured-image-preview');
    const uploadImageBtn = document.getElementById('upload-image-btn');
    const imageUpload = document.getElementById('image-upload');
    
    // Elementos de los modales
    const linkModal = document.getElementById('link-modal');
    const imageModal = document.getElementById('image-modal');
    const insertLinkBtn = document.getElementById('insert-link-btn');
    const cancelLinkBtn = document.getElementById('cancel-link-btn');
    const linkUrl = document.getElementById('link-url');
    const linkText = document.getElementById('link-text');
    const insertImageBtn = document.getElementById('insert-image-btn');
    const cancelImageBtn = document.getElementById('cancel-image-btn');
    const imageUrl = document.getElementById('image-url');
    const imageAlt = document.getElementById('image-alt');
    const localImageUpload = document.getElementById('local-image-upload');

    // Variables de estado
    let currentEditingPost = null;
    let featuredImageFile = null;
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

    // Inicialización
    renderPostsTable();
    setupEditorToolbar();
    setupEventListeners();

    // Funciones principales
    function setupEventListeners() {
        // Navegación
        newPostBtn.addEventListener('click', showNewPostSection);
        managePostsBtn.addEventListener('click', showManagePostsSection);
        
        // Publicación
        publishBtn.addEventListener('click', savePost);
        
        // Vista previa en tiempo real
        postTitle.addEventListener('input', updatePreview);
        postContent.addEventListener('input', updatePreview);
        postExcerpt.addEventListener('input', updatePreview);
        
        // Imagen destacada
        uploadImageBtn.addEventListener('click', () => imageUpload.click());
        imageUpload.addEventListener('change', handleFeaturedImageUpload);
        
        // Modales
        insertLinkBtn.addEventListener('click', insertLink);
        cancelLinkBtn.addEventListener('click', () => linkModal.style.display = 'none');
        insertImageBtn.addEventListener('click', insertImage);
        cancelImageBtn.addEventListener('click', () => imageModal.style.display = 'none');
        localImageUpload.addEventListener('change', handleLocalImageUpload);

        // Agregar esto en setupEventListeners()
        document.getElementById('export-json-btn').addEventListener('click', exportPostsToJSON);

        // Agregar esta función
        function exportPostsToJSON() {
            const dataStr = JSON.stringify(posts, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'posts.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);  
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
}
    }

    function setupEditorToolbar() {
        const buttons = document.querySelectorAll('.editor-toolbar button[data-command]');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                
                if (command === 'createLink') {
                    showLinkModal();
                } else if (command === 'insertImage') {
                    showImageModal();
                } else {
                    document.execCommand(command, false, null);
                    postContent.focus();
                }
            });
        });
    }

    function showNewPostSection() {
        newPostSection.classList.remove('hidden');
        managePostsSection.classList.add('hidden');
        resetForm();
    }

    function showManagePostsSection() {
        newPostSection.classList.add('hidden');
        managePostsSection.classList.remove('hidden');
        renderPostsTable();
    }

    function resetForm() {
        postTitle.value = '';
        postContent.innerHTML = '';
        postExcerpt.value = '';
        postCategory.value = 'estudios';
        postStatus.value = 'publish';
        featuredImagePreview.style.display = 'none';
        featuredImagePreview.src = '';
        featuredImageFile = null;
        currentEditingPost = null;
        updatePreview();
    }

    function savePost() {
        const title = postTitle.value.trim();
        const content = postContent.innerHTML;
        const excerpt = postExcerpt.value.trim();
        const category = postCategory.value;
        const status = postStatus.value;
        
        if (!title) {
            alert('El título es requerido');
            return;
        }
        
        if (!content) {
            alert('El contenido es requerido');
            return;
        }
        
        const slug = generateSlug(title);
        const date = new Date().toISOString().split('T')[0];
        const formattedDate = formatDate(new Date());
        
        // Crear objeto del post
        const post = {
            id: slug,
            title,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            category,
            status,
            date: formattedDate,
            featuredImage: featuredImageFile ? URL.createObjectURL(featuredImageFile) : ''
        };
        
        // Si estamos editando, actualizamos el post existente
        if (currentEditingPost) {
            const index = posts.findIndex(p => p.id === currentEditingPost.id);
            if (index !== -1) {
                posts[index] = post;
            }
        } else {
            // Si es nuevo, lo añadimos al array
            posts.unshift(post);
        }
        
        // Guardar en localStorage
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Generar archivo HTML para el post
        generatePostHTML(post);
        
        alert('Post guardado correctamente');
        resetForm();
        showManagePostsSection();
    }

    function generatePostHTML(post) {
        const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title} | Rousseau Sade</title>
        <link rel="stylesheet" href="../CSS/blog-post.css">
        <link rel="icon" href="../Assets/Images/icon.svg">
    </head>
    <body>
        <header class="blog-header">
            <div class="header-content">
                <div class="logo-container">
                    <img src="../Assets/Images/icon.svg" alt="Logo" class="logo">
                    <h1>Rousseau Sade</h1>
                </div>
                <nav class="blog-nav">
                    <a href="../index.html">Home</a>
                    <a href="../Education/education.html">Education</a>
                    <a href="blog.html">Blog</a>
                </nav>
            </div>
        </header>

        <main class="blog-post-container">
            <article class="blog-post">
                <div class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                </div>
                
                ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" class="featured-image">` : ''}
                
                <div class="post-content">
                    ${post.content}
                </div>
                
                <div class="post-footer">
                    <a href="blog.html" class="back-to-blog">← Volver al Blog</a>
                </div>
            </article>
        </main>

        <footer class="blog-footer">
            <p>© ${new Date().getFullYear()} Rousseau Sade. Todos los derechos reservados.</p>
        </footer>
    </body>
    </html>`;

        // Crear un blob con el contenido HTML
        const blob = new Blob([html], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        
        // Crear un enlace para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = `${post.id}.html`;
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    function renderPostsTable() {
        postsTable.innerHTML = '';
        
        if (posts.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center;">No hay posts disponibles</td>`;
            postsTable.appendChild(row);
            return;
        }

        function checkLocalStorage() {
            const storedPosts = localStorage.getItem('blogPosts');
            if (!storedPosts) {
                localStorage.setItem('blogPosts', JSON.stringify([]));
                posts = [];
            } else {
                posts = JSON.parse(storedPosts);
            }
        }

        // Llamar esta función al inicio
        document.addEventListener('DOMContentLoaded', function() {
            checkLocalStorage();
            // ... resto del código de inicialización
        });
        
        posts.forEach(post => {
            const row = document.createElement('tr');
            row.dataset.id = post.id; // Añadir ID como atributo de datos
            
            row.innerHTML = `
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${post.date}</td>
                <td>${post.status === 'publish' ? 'Publicado' : 'Borrador'}</td>
                <td class="actions">
                    <button class="edit-post" data-id="${post.id}">Editar</button>
                    <button class="delete-post" data-id="${post.id}">Eliminar</button>
                </td>
            `;
            
            postsTable.appendChild(row);
        });
        
        // Delegación de eventos para mejor rendimiento
        postsTable.addEventListener('click', function(e) {
            const target = e.target;
            
            if (target.classList.contains('delete-post')) {
                deletePost(target.dataset.id);
            } else if (target.classList.contains('edit-post')) {
                editPost(target.dataset.id);
            }
        });
    }

    function editPost(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Post no encontrado');
            return;
        }
        
        currentEditingPost = post;
        postTitle.value = post.title;
        postContent.innerHTML = post.content;
        postExcerpt.value = post.excerpt;
        postCategory.value = post.category;
        postStatus.value = post.status;
        
        if (post.featuredImage) {
            featuredImagePreview.src = post.featuredImage;
            featuredImagePreview.style.display = 'block';
            // Necesitamos manejar el archivo de imagen también
            fetch(post.featuredImage)
                .then(res => res.blob())
                .then(blob => {
                    featuredImageFile = new File([blob], 'featured-image.jpg', {type: blob.type});
                });
        } else {
            featuredImagePreview.style.display = 'none';
            featuredImagePreview.src = '';
            featuredImageFile = null;
        }
        
        showNewPostSection();
        updatePreview();
    }

    function deletePost(postId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este post permanentemente?')) {
            return;
        }

        // Filtrar el post a eliminar
        posts = posts.filter(p => p.id !== postId);
        
        // Actualizar localStorage
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Volver a renderizar la tabla
        renderPostsTable();
        
        // Si estábamos editando el post eliminado, resetear el formulario
        if (currentEditingPost && currentEditingPost.id === postId) {
            resetForm();
        }
        
        // Mostrar confirmación
        alert('Post eliminado correctamente');
    }

    function updatePreview() {
        const title = postTitle.value || 'Título del Post';
        const content = postContent.innerHTML || '<p>Contenido del post...</p>';
        const excerpt = postExcerpt.value || content.substring(0, 150) + '...';
        
        postPreview.innerHTML = `
            <h3>${title}</h3>
            <p><small>${postCategory.options[postCategory.selectedIndex].text} • ${formatDate(new Date())}</small></p>
            <div>${excerpt}</div>
        `;
    }

    function showLinkModal() {
        linkUrl.value = '';
        linkText.value = '';
        linkModal.style.display = 'flex';
    }

    function insertLink() {
        const url = linkUrl.value.trim();
        const text = linkText.value.trim();
        
        if (!url) {
            alert('La URL es requerida');
            return;
        }
        
        document.execCommand('createLink', false, url);
        
        if (text) {
            const selection = window.getSelection();
            if (selection.rangeCount) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        }
        
        linkModal.style.display = 'none';
        postContent.focus();
    }

    function showImageModal() {
        imageUrl.value = '';
        imageAlt.value = '';
        imageModal.style.display = 'flex';
    }

    function insertImage() {
        const url = imageUrl.value.trim();
        const alt = imageAlt.value.trim() || 'Imagen del post';
        
        if (!url && !localImageUpload.files[0]) {
            alert('Debes proporcionar una URL o subir una imagen');
            return;
        }
        
        const img = document.createElement('img');
        img.alt = alt;
        img.style.maxWidth = '100%';
        
        if (url) {
            img.src = url;
        } else {
            const file = localImageUpload.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
                const range = window.getSelection().getRangeAt(0);
                range.insertNode(img);
            };
            reader.readAsDataURL(file);
            imageModal.style.display = 'none';
            return;
        }
        
        const range = window.getSelection().getRangeAt(0);
        range.insertNode(img);
        imageModal.style.display = 'none';
        postContent.focus();
    }

    function handleLocalImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            imageUrl.value = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function handleFeaturedImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        featuredImageFile = file;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            featuredImagePreview.src = event.target.result;
            featuredImagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Funciones de utilidad
    function generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            .substring(0, 50);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }
});