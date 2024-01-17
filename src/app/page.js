'use client'
import PageLayout from '~/components/layouts/FullLayout'
import Slider from './Slider'

export default function Page() {
  return (
    <PageLayout hideNavigator={true}>
      <Slider />
    </PageLayout>
  )
}
