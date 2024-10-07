<script>

    import { Button } from "$lib/components/ui/button";

    export let links = [
       { name: 'Home', href: '/' },
       { name: 'Games', href: '/games' },
       { name: 'Watch', href: '/watch' }
    ];

    let isDarkMode = false;

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    } 

    import { page } from '$app/stores';

    import { onMount } from 'svelte';

    $: currentRoute = $page.url.pathname;

   //  onMount(() => {
   //    toggleDarkMode()
   //  })

   //  window.onload = toggleDarkMode;
    
 </script>
 
 <nav class="bg-white dark:bg-black border-b border-gray-200 dark:border-slate-900 shadow-md p-1">
    <div class="container mx-auto px-4 py-4 flex items-center">
       <!-- Logo -->
       <div class="text-lg font-bold flex-1 dark:text-white">CFB Gameday ({currentRoute})</div>
 
       <!-- Navigation Links -->
       <div class="space-x-6 flex-4 flex">
          {#each links as link}
             <a
                href={link.href}
                class="text-gray-700 dark:text-white dark:hover:text-green-500 hover:text-blue-500 transition-colors duration-200"
                >{link.name}</a
             >
          {/each}
       </div>
       <div class="flex-1 flex justify-center">
        <Button on:click={toggleDarkMode} class="text-gray-700 dark:text-black">
            {#if isDarkMode}
              <span>🌞 Light Mode</span>
            {:else}
              <span>🌙 Dark Mode</span>
            {/if}
          </Button>
       </div>
    </div>
 </nav>