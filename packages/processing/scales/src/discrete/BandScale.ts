import { scaleBand } from 'd3-scale'
import { DomainRangeScale } from '../DomainRangeScale'
import { CreateScaleArgs, Dimension, Scales } from '@gog/mark-spec-interfaces'

export interface BandScaleProps {
	/**
	 * The name of the band-width static scale
	 */
	bandWidth?: string

	/**
	 * The outer and inner padding value
	 */
	padding?: number

	/**
	 * The outer and inner padding value
	 */
	paddingInner?: number

	/**
	 * The outer and inner padding value
	 */
	paddingOuter?: number

	/**
	 * Bin alignment 0-beginning, 1=end
	 */
	align?: number
}

export class BandScale extends DomainRangeScale<
	string[],
	[number, number],
	Dimension
> {
	private paddingValue?: number
	private paddingInnerValue?: number
	private paddingOuterValue?: number
	private alignValue?: number
	private bandwidthValue?: string

	/**
	 * The name of the band-width static scale
	 */
	public bandwidth(value?: string) {
		this.bandwidthValue = value
		return this
	}

	/**
	 * The outer and inner padding value
	 */
	public padding(value?: number) {
		this.paddingValue = value
		return this
	}

	/**
	 * The inner padding value
	 */
	public paddingInner(value?: number) {
		this.paddingInnerValue = value
		return this
	}

	/**
	 * The outer padding value
	 */
	public paddingOuter(value?: number) {
		this.paddingOuterValue = value
		return this
	}

	/**
	 * Bin alignment 0-beginning, 1=end
	 */
	public align(value?: number) {
		this.alignValue = value
		return this
	}

	protected createScale(args: CreateScaleArgs) {
		const domain = this.getDomain(args)
		const range = this.getRange(args)
		const bandscale = scaleBand()
			.domain(domain.map(d => '' + d))
			.range(range)

		if (this.alignValue) {
			bandscale.align(this.alignValue)
		}
		if (this.paddingValue) {
			bandscale.padding(this.paddingValue)
		}
		if (this.paddingOuterValue) {
			bandscale.paddingOuter(this.paddingOuterValue)
		}
		if (this.paddingInnerValue) {
			bandscale.paddingInner(this.paddingInnerValue)
		}

		const result: Scales = { [this.nameValue as string]: bandscale }
		if (this.bandwidthValue) {
			result[this.bandwidthValue as string] = bandscale.bandwidth
		}
		return result
	}

	protected handleRangeBind(
		args: CreateScaleArgs,
		rangeBind: Dimension,
	): [number, number] {
		if (rangeBind === Dimension.HEIGHT) {
			return [0, args.view.height]
		} else {
			return [0, args.view.width]
		}
	}
}