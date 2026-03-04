const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// إذا أردت إضافة طبقة تعتيم، أضف هذا السطر في الـ HTML: <div id="overlay" class="menu-overlay"></div>
// const overlay = document.getElementById('overlay'); 

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    // if(overlay) overlay.classList.toggle('active');
});

// إغلاق القائمة عند الضغط على أي رابط
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});