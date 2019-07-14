<template>
  <div class="getting-started">
    <h1>Getting started</h1>
    <p>
      In order to get started using this app, we need to know what the idea's about.
      Otherwise, this may look like just another random die result generator to you (although it is one, I won't fight against that 😋).
    </p>
    <p>The <a href="https://www.youtube.com/channel/UCSl5Uxu2LyaoAoMMGp6oTJA">creator of this idea</a> has said that the inspiration came from a technique he learnt from <a href="https://www.edwddebono.com/">Edward de Bono</a>, known to be the 'father of lateral thinking'.</p>
    <p>The technique he referred to on one of his comments in the linked video is described as the following:</p>
    <blockquote>...a process of provoking creativity by listing the attributes of a thing, deleting one of them, then trying to recreate it differently based on a random input. The dice takes it to the extreme &mdash; start with no attributes and inject them all randomly.</blockquote>
    <p>After seeing that statement, I decided to check out some of de Bono's work and that's where I found interesting things.</p>
    <p>
      I modelled this app after a specific thinking tool of de Bono which is the <a href="https://creativiteach.me/creative-thinking-strategies/random-input/">random input</a> and the approach of listing the attributes of an object or a class.
      You pick a universal class or an object then you list its attributes. Say that you want to list some colors. You do that in the app by adding a die, naming it 'Colors', then adding items of that die and listing off the colors.
      Simple as that until you added enough dice for your virtual idea dice set (or VIDS, for short).
    </p>
    <p>
      With more dice in your set, the more possibilities of a non-sensical random ideas will occur
      and that's what the app is all about (or at least in my perspective). However, like all things in life,
      don't put too much eggs in one basket.
    </p>
    <p>
      OK! Introductory speech is done. Why don't you go ahead and <router-link :to=app_route>use the app</router-link>.
    </p>
  </div>
</template>

<script>
import { routes } from '../constants'

export default {
  name: 'About',
  data: function () {
    return {
      app_route: routes.app.path
    }
  }
}
</script>
