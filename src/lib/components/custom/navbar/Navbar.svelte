<script lang='ts'>

    import { Button } from "$lib/components/ui/button";

    import { onMount } from "svelte";

    import { themeStore, AltTheme } from "../themeStore/themeStore";

    export let links = [
       { name: 'Home', href: '/' },
       { name: 'Teams', href: '/teams' },
       { name: 'Watch', href: '/watch' }
    ];

    

    let isDarkMode = false

    let isAlt = false

    function toggleDarkMode() {

         themeStore.update(currentTheme => {
            const newTheme = !currentTheme

            isDarkMode = !currentTheme

            localStorage.setItem('theme', !currentTheme ? 'dark' : 'light');
            
            if (newTheme === true) // to dark mode
            {
               document.documentElement.classList.add('dark');
            }
            else // light
            {
               document.documentElement.classList.remove('dark');
            }

            return newTheme;
         });
      }

   function toggleAlt() {

      AltTheme.update(currentTheme => {
         const newTheme = !currentTheme

         isAlt = !currentTheme

         localStorage.setItem('alt', !currentTheme ? 'yes' : 'no');

         return newTheme;
      });
}


    import { page } from '$app/stores';

    $: currentRoute = $page.url.pathname;

    onMount(() => {

      if (localStorage.getItem('theme') === 'dark') 
      {
         document.documentElement.classList.add('dark');
         themeStore.set(true)
         isDarkMode = true
      }

      if (localStorage.getItem('alt') === 'yes') 
      {
         AltTheme.set(true)
         isAlt = true
      }

    })

   //  window.onload = toggleDarkMode;
    
 </script>
 
 <nav class="bg-white dark:bg-black border-b border-gray-200 dark:border-slate-900 shadow-md p-1">
    <div class="container mx-auto px-4 py-4 flex items-center">
       <!-- Logo -->
       <div class="text-lg font-bold flex-1 dark:text-white">CFB Gameday ({currentRoute})</div>
 
       <!-- Navigation Links -->
       <div class="space-x-6 flex-1 flex justify-center text-center">
          {#each links as link}
             <a
                href={link.href}
                class="text-gray-700 dark:text-white dark:hover:text-green-500 hover:text-blue-500 transition-colors duration-200"
                >{link.name}</a
             >
          {/each}
       </div>
       <div class="flex flex-1 justify-center space-x-4">
         <div class="flex justify-center">
         <Button on:click={toggleDarkMode} class="text-white dark:text-black">
               {#if isDarkMode}
               <span>🌙 Dark Mode</span>
               {:else}
               <span>🌞 Light Mode</span>
               {/if}
            </Button>
         </div>
         <div class=" flex justify-center">
            <Button on:click={toggleAlt} class={`text-white ${isAlt ? 'bg-red-700' : 'bg-green-700'}`}>
               {#if isAlt}
                  <span>Alt</span>
               {:else}
                  <span>Regular</span>
               {/if}
            </Button>
         </div>
      </div>
    </div>
 </nav>