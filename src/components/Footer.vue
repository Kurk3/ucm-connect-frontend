<!-- Footer.vue -->
<template>
    <footer class="rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-sm mt-16 mb-2">
      <div class="max-w-7xl mx-auto p-12">
        <!-- Main Footer Content -->
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 justify-items-start justify-self-start">
          
          <!-- About Column -->
          <div>
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-4">O nás</h3>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300">
              <li><router-link to="/landing" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">O UCM Connect</router-link></li>
              <li><router-link to="/landing#team" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funkcie</router-link></li>
              <li><router-link to="/landing#team" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tím</router-link></li>
            </ul>
          </div>
  
          <!-- Help Column -->
          <div>
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-4">Pomoc</h3>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300">
              <li><router-link to="/faq" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Často kladené otázky</router-link></li>
              <li><router-link to="/contact" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kontakt</router-link></li>
              <li><router-link to="/guidelines" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pravidlá komunity</router-link></li>
              <li><router-link to="/support" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Podpora</router-link></li>
            </ul>
          </div>
  
          <!-- Legal Column -->
          <div>
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-4">Právne</h3>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300">
              <li><router-link to="/terms" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Podmienky používania</router-link></li>
              <li><router-link to="/privacy" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ochrana súkromia</router-link></li>
            <li><router-link to="/cookies" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Súbory cookie</router-link></li>
              <li><router-link to="/content-policy" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Politika obsahu</router-link></li>
            </ul>
          </div>
  
          <!-- Resources Column -->
          <div>
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-4">Zdroje</h3>
            <ul class="space-y-2 text-gray-700 dark:text-gray-300">
              <li><router-link to="/accessibility" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Prístupnosť</router-link></li>
              <li><router-link to="/academic-integrity" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Akademická integrita</router-link></li>
              <li><router-link to="/security" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bezpečnosť</router-link></li>
            </ul>
          </div>
        </div>
  
        <!-- Bottom Bar -->
        <div class="border-t border-gray-400 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-700 dark:text-gray-300">© 2025 UCM Connect. Všetky práva vyhradené.</p>
          <a href="https://www.ucm.sk" target="_blank" class="text-sm text-blue-600 hover:underline">Oficiálna stránka UCM</a>
        </div>
      </div>
    </footer>
  </template>