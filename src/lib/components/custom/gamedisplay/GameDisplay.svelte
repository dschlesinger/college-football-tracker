<script>

  import { Card } from "$lib/components/ui/card";

</script>

<div class="grid grid-cols-4 gap-4 p-10">
  {#each Array(16) as _, index}
    <Card class="flex items-center justify-center h-32 text-lg font-semibold text-white bg-blue-500">
      Item {index + 1}
    </Card>
  {/each}
</div>
