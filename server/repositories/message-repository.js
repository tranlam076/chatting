'use strict';

import BaseRepository from '../repositories/base-repository';
import {Message} from '../models/'

export default class GroupRepository extends BaseRepository {

	constructor() {
		super(Message);
	}
}
