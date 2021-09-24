<template>
  <div>我是一个花</div>
</template>

<script>
export default {
  setup(){
    const testFunction = () => {
      console.log('vue3 very nice')
    }
    return {
      testFunction
    }
  }
}
</script>

<style>
div{
  color: yellowgreen;
}
</style>