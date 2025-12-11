<template>
  <h2 class="text-xl font-semibold text-gray-800 mb-4">🚨 Emergencias</h2>
        <div class="space-y-4">
          <div v-for="(contact, index) in emergencyContacts" :key="index"
            class="p-3 bg-red-50 rounded-lg flex items-center space-x-3">
            <div class="bg-red-100 p-2 rounded-full">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ contact.name }}</p>
              <p class="text-sm text-red-600">{{ contact.number }}</p>
            </div>
          </div>
        </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const emergencyContacts = ref([
      { name: 'Emergencias', number: '065' },
      { name: 'Ambulancias', number: '911' },
      { name: 'Cruz Roja', number: '555-1234' }
    ]);

    return {
      emergencyContacts
    };
  }
};
</script>
