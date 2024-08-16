import { useState } from 'react'
import './Tabs.scss'
import { useSearchParams } from 'react-router-dom'

const Tabs = () => {
	const [activeTab, setActiveTab] = useState<string>('New')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setSearchParams] = useSearchParams()

	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
		setSearchParams(`?sortBy=${tab.toLowerCase()}`)
	}

	return (
		<ul className='tabs'>
			<li
				className={activeTab === 'New' ? 'active' : ''}
				onClick={e => handleTabClick('New')}
			>
				New
			</li>
			<li
				className={activeTab === 'Popular' ? 'active' : ''}
				onClick={e => handleTabClick('Popular')}
			>
				Popular
			</li>
		</ul>
	)
}

export default Tabs
