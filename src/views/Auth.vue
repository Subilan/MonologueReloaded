<script setup lang="ts">
    import { Banner, BlockStack, Box, Button, ButtonGroup, Card, Form, FormLayout, InlineGrid, InlineStack, LayoutSection, Modal, Text, TextContainer, TextField } from '@ownego/polaris-vue';
    import { onMounted, ref, watch } from 'vue';
    import Logo from '@/components/Logo.vue';
    import router from '@/router';
    import { FAILURE_AUTH_USERNAME_OR_PASSWORD } from '@/i18n/zh_cn';
    import type { Tone } from '@/types';

    const username = ref('');
    const password = ref('');

    const ui__usernameError = ref('');
    const ui__passwordError = ref('');

    const ui__loginBtnLoading = ref(false);

    const ui__loginFailure = ref(false);
    const ui__loginFailureTone = ref('warning');
    const ui__loginFailureCause = ref('');

    function raiseError(cause: string, tone: Tone = 'warning') {
        ui__loginFailure.value = true;
        ui__loginFailureTone.value = tone;
        ui__loginFailureCause.value = cause;
        ui__loginBtnLoading.value = false;
    }

    function checkfield__username() {
        if (username.value.trim().length === 0) {
            ui__usernameError.value = '用户名必填';
            return false;
        }

        ui__usernameError.value = '';
        return true;
    }

    function checkfield__password() {
        if (password.value.trim().length === 0) {
            ui__passwordError.value = '密码必填';
            return false;
        }

        ui__passwordError.value = '';
        return true;
    }

    function check() {
        return ![checkfield__username(), checkfield__password()].includes(false);
    }

    function submit() {
        if (!check()) return;

        ui__loginBtnLoading.value = true;

        raiseError(FAILURE_AUTH_USERNAME_OR_PASSWORD);
    }

    watch(username, v => checkfield__username());
    watch(password, v => checkfield__password());
</script>

<template>
    <Page>
        <Layout>
            <LayoutSection>
                <BlockStack align="center" inline-align="center" style="height: 100dvh;">
                    <LegacyCard rounded-above="xs" class="constraint__authLoginCard">
                        <Box padding="400">
                            <BlockStack inline-align="center">
                                <Text variant="heading2xl" as="h2">
                                    <Logo />
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    登入仪表盘
                                </Text>
                            </BlockStack>
                            <Box padding-block-start="200" v-if="ui__loginFailure">
                                <Banner tone="warning">
                                    <Text as="p">
                                        {{ ui__loginFailureCause }}
                                    </Text>
                                </Banner>
                            </Box>
                            <Box padding-block-start="200">
                                <Form no-validate @submit="submit">
                                    <FormLayout>
                                        <TextField :error="ui__usernameError" required-indicator size="slim" label="用户名"
                                            auto-complete="off" v-model="username" />
                                        <TextField :error="ui__passwordError" required-indicator size="slim" label="密码"
                                            type="password" auto-complete="off" v-model="password" />
                                    </FormLayout>
                                </Form>
                            </Box>
                            <Box padding-block-start="400">
                                <InlineStack align="end">
                                    <ButtonGroup>
                                        <Button :loading="ui__loginBtnLoading" @click="submit" variant="primary">
                                            登录
                                        </Button>
                                        <Button @click="router.push({ name: 'register' })">
                                            注册
                                        </Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </Box>
                        </Box>
                    </LegacyCard>
                </BlockStack>
            </LayoutSection>
        </Layout>
    </Page>
</template>

<style lang="scss">
.constraint__authLoginCard {
    @media (min-width: 30.625em) {
        width: 500px;
    }

    @media (max-width: 30.6225em) {
        width: 80%;
    }
}
</style>