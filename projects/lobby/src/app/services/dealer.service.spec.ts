import { TestBed } from '@angular/core/testing';

import { CardGameFactoryService } from './dealer.service';

describe('CardGameFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardGameFactoryService = TestBed.get(CardGameFactoryService);
    expect(service).toBeTruthy();
  });
});
